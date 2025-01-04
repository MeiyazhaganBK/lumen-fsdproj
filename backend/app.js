const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error during login' });
  }
});

// Protected routes example
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});


//authenticateToken,authorize(['ADMIN', 'MANAGER']),
app.post(
  '/api/products',
  
  async (req, res) => {
    try {
      const { name, description, categoryId, currentStock, reorderPoint, price, sku } = req.body;
      console.log(name, description, categoryId, currentStock, reorderPoint, price, sku);
      const product = await prisma.product.create({
        data: {
          name,
          description,
          categoryId,
          currentStock,
          reorderPoint,
          price,
          sku,
        },
        include: {
          category: true,
        },
      });
      console.log(product);
      res.json(product);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error creating product' });
    }
  }
);

// User Management
app.get('/api/users', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.post('/api/users', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.put('/api/users/:id', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, name, role },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

app.delete('/api/users/:id', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Product Management
app.put('/api/products/:id', authenticateToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, currentStock, reorderPoint, price, sku } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, categoryId, currentStock, reorderPoint, price, sku },
      include: { category: true },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

app.delete('/api/products/:id', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Category Management , authenticateToken
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

app.post('/api/categories', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
});

// Stock Transactions  authenticateToken, authorize(['ADMIN', 'MANAGER', 'STAFF'])
app.post('/api/stock-transactions', async (req, res) => {
  try {
    const { productId, quantity, type, notes } = req.body;
    const transaction = await prisma.stockTransaction.create({
      data: {
        productId: parseInt(productId),
        userId: req.user.id,
        quantity,
        type,
        notes,
      },
      include: { product: true, user: true },
    });

    app.get('/api/stock-transactions', async (req, res) => {
        try {
          const stockTransactions = await prisma.stockTransaction.findMany({
            include: {
              product: true,
              user: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
      
          res.status(200).json(stockTransactions);
        } catch (error) {
          console.error('Error fetching stock transactions:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });


      // DELETE /api/stock-transactions/:id
app.delete('/api/stock-transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedTransaction = await prisma.stockTransaction.delete({
        where: {
          id: parseInt(id),
        },
      });
  
      res.status(200).json(deletedTransaction);
    } catch (error) {
      console.error('Error deleting stock transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
    
    // Update product stock
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { currentStock: { increment: quantity } },
    });
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating stock transaction' });
  }
});

// Supplier Management
app.get('/api/suppliers', authenticateToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
});

app.post('/api/suppliers', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const supplier = await prisma.supplier.create({
      data: { name, email, phone, address },
    });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Error creating supplier' });
  }
});

app.put('/api/suppliers/:id', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, address },
    });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Error updating supplier' });
  }
});

app.delete('/api/suppliers/:id', authenticateToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting supplier' });
  }
});

// Supplier Orders
app.get('/api/supplier-orders', authenticateToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const orders = await prisma.supplierOrder.findMany({
      include: { supplier: true, items: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching supplier orders' });
  }
});

app.post('/api/supplier-orders', authenticateToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { supplierId, items } = req.body;
    const order = await prisma.supplierOrder.create({
      data: {
        supplierId: parseInt(supplierId),
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { supplier: true, items: true },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error creating supplier order' });
  }
});

app.put('/api/supplier-orders/:id', authenticateToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.supplierOrder.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { supplier: true, items: true },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating supplier order' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

