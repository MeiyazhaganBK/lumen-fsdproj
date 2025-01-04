import React, { useState, useEffect } from 'react';
import { Package, Truck, ClipboardList, Edit, Plus } from 'lucide-react';
import { getProducts, updateProduct, getSuppliers, updateSupplier, getStockTransactions, createStockTransaction } from './services/api';

const ManagerPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
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
      setShowDialog(false);
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
      setShowDialog(false);
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
      setShowDialog(false);
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const Dialog = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          {children}
        </div>
      </div>
    );
  };

  const renderProductsTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">View/Edit Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left border-b">Name</th>
              <th className="py-2 px-4 text-left border-b">Category</th>
              <th className="py-2 px-4 text-left border-b">Price</th>
              <th className="py-2 px-4 text-left border-b">Stock</th>
              <th className="py-2 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category.name}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4">{product.currentStock}</td>
                <td className="py-2 px-4">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setProductForm({ ...product, category: product.category.name });
                      setEditingId(product.id);
                      setShowDialog(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        isOpen={showDialog && editingId && activeTab === 'products'}
        onClose={() => setShowDialog(false)}
        title="Edit Product"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );

  const renderSuppliersTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">View/Edit Suppliers</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left border-b">Name</th>
              <th className="py-2 px-4 text-left border-b">Contact Person</th>
              <th className="py-2 px-4 text-left border-b">Email</th>
              <th className="py-2 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="py-2 px-4">{supplier.name}</td>
                <td className="py-2 px-4">{supplier.contact}</td>
                <td className="py-2 px-4">{supplier.email}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSupplierForm(supplier);
                      setEditingId(supplier.id);
                      setShowDialog(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        isOpen={showDialog && editingId && activeTab === 'suppliers'}
        onClose={() => setShowDialog(false)}
        title="Edit Supplier"
      >
        <form onSubmit={handleUpdateSupplier} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={supplierForm.name}
              onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={supplierForm.contact}
              onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={supplierForm.email}
              onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );

  const renderTransactionsTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Stock Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left border-b">Date</th>
              <th className="py-2 px-4 text-left border-b">Product</th>
              <th className="py-2 px-4 text-left border-b">Quantity</th>
              <th className="py-2 px-4 text-left border-b">Type</th>
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

      <button
        className="mt-4 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center"
        onClick={() => setShowDialog(true)}
      >
        <Plus size={18} className="mr-2" />
        Add Transaction
      </button>

      <Dialog
        isOpen={showDialog && activeTab === 'transactions'}
        onClose={() => setShowDialog(false)}
        title="Add Transaction"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={transactionForm.quantity}
              onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={transactionForm.type}
              onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
              required
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded flex items-center ${
            activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('products')}
        >
          <Package className="mr-2" size={18} />
          Products
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded flex items-center ${
            activeTab === 'suppliers' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('suppliers')}
        >
          <Truck className="mr-2" size={18} />
          Suppliers
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center ${
            activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <ClipboardList className="mr-2" size={18} />
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