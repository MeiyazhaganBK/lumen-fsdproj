import React, { useState, useEffect } from 'react';
import { Package, Truck, ClipboardList, Edit, Trash, Plus } from 'lucide-react';
import { getProducts, updateProduct, getSuppliers, updateSupplier, getStockTransactions, createStockTransaction } from './services/api';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

const ManagerPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', stock: '' });
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', email: '' });
  const [transactionForm, setTransactionForm] = useState({ productId: '', quantity: '', type: 'STOCK_IN' });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const fetchedSuppliers = await getSuppliers();
      setSuppliers(fetchedSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const fetchedTransactions = await getStockTransactions();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingId, productForm);
      setProductForm({ name: '', category: '', price: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      await updateSupplier(editingId, supplierForm);
      setSupplierForm({ name: '', contact: '', email: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    try {
      await createStockTransaction(transactionForm);
      setTransactionForm({ productId: '', quantity: '', type: 'STOCK_IN' });
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const renderProductsTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">View/Edit Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category.name}</td>
                {/* <td className="py-2 px-4">${product.price.toFixed(2)}</td> */}
                <td className="py-2 px-4">{product.currentStock}</td>
                <td className="py-2 px-4">
                  <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => {
                    setProductForm({ ...product, category: product.category.name });
                    setEditingId(product.id);
                  }}>
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Edit Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderSuppliersTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">View/Edit Suppliers</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Contact Person</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="py-2 px-4">{supplier.name}</td>
                <td className="py-2 px-4">{supplier.contact}</td>
                <td className="py-2 px-4">{supplier.email}</td>
                <td className="py-2 px-4">
                  <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => {
                    setSupplierForm(supplier);
                    setEditingId(supplier.id);
                  }}>
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Edit Supplier</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSupplier} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                value={supplierForm.contact}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderTransactionsTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Stock Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="py-2 px-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4">{transaction.product.name}</td>
                <td className="py-2 px-4">{transaction.quantity}</td>
                <td className="py-2 px-4">{transaction.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Plus size={18} className="inline mr-2" />
            Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <div>
              <Label htmlFor="product">Product</Label>
              <Select value={transactionForm.productId} onValueChange={(value) => setTransactionForm({ ...transactionForm, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={transactionForm.quantity}
                onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={transactionForm.type} onValueChange={(value) => setTransactionForm({ ...transactionForm, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK_IN">Stock In</SelectItem>
                  <SelectItem value="STOCK_OUT">Stock Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Transaction</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('products')}
        >
          <Package className="inline mr-2" />
          Products
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === 'suppliers' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('suppliers')}
        >
          <Truck className="inline mr-2" />
          Suppliers
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <ClipboardList className="inline mr-2" />
          Transactions
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'suppliers' && renderSuppliersTab()}
        {activeTab === 'transactions' && renderTransactionsTab()}
      </div>
    </div>
  );
};

export default ManagerPage;

