import React, { useState, useEffect } from 'react';
import { Users, Package, Truck, Plus, Edit, Trash } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser, getProducts, createProduct, updateProduct, deleteProduct, getSuppliers, createSupplier, updateSupplier, deleteSupplier, getCategories } from './services/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialUserForm = { name: '', email: '', password: '', role: 'STAFF' };
  const initialProductForm = { name: '', description: '', categoryId: '', price: '', currentStock: '', reorderPoint: '', sku: '' };
  const initialSupplierForm = { name: '', email: '', phone: '', address: '' };

  const [userForm, setUserForm] = useState(initialUserForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [supplierForm, setSupplierForm] = useState(initialSupplierForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedUsers, fetchedProducts, fetchedSuppliers, fetchedCategories] = await Promise.all([
        getUsers(),
        getProducts(),
        getSuppliers(),
        getCategories()
      ]);
      setUsers(fetchedUsers);
      setProducts(fetchedProducts);
      setSuppliers(fetchedSuppliers);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setUserForm(initialUserForm);
    setProductForm(initialProductForm);
    setSupplierForm(initialSupplierForm);
  };

  const handleCreate = async (e, type) => {
    e.preventDefault();
    try {
      if (type === 'user') await createUser(userForm);
      if (type === 'product') await createProduct(productForm);
      if (type === 'supplier') await createSupplier(supplierForm);
      
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
    }
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    try {
      if (type === 'user') await updateUser(editingId, userForm);
      if (type === 'product') await updateProduct(editingId, productForm);
      if (type === 'supplier') await updateSupplier(editingId, supplierForm);
      
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'user') await deleteUser(id);
      if (type === 'product') await deleteProduct(id);
      if (type === 'supplier') await deleteSupplier(id);
      
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleEdit = (item, type) => {
    setEditingId(item.id);
    if (type === 'user') setUserForm({ ...item, password: '' });
    if (type === 'product') setProductForm({ ...item, categoryId: item.category.id.toString() });
    if (type === 'supplier') setSupplierForm(item);
    setIsModalOpen(true);
  };

  const renderUsersTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left border-b">Name</th>
              <th className="py-2 px-4 text-left border-b">Email</th>
              <th className="py-2 px-4 text-left border-b">Role</th>
              <th className="py-2 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <button 
                    onClick={() => handleEdit(user, 'user')}
                    className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id, 'user')}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <Plus size={18} className="mr-2" />
        Add User
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit User' : 'Add User'}</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => editingId ? handleUpdate(e, 'user') : handleCreate(e, 'user')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderProductsTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
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
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category.name}</td>
                {/* <td className="py-2 px-4">${product.price.toFixed(2)}</td> */}
                <td className="py-2 px-4">{product.currentStock}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(product, 'product')}
                    className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, 'product')}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <Plus size={18} className="mr-2" />
        Add Product
      </button>

      {/* Similar modal structure for products */}
    </div>
  );

  const renderSuppliersTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Suppliers</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left border-b">Name</th>
              <th className="py-2 px-4 text-left border-b">Email</th>
              <th className="py-2 px-4 text-left border-b">Phone</th>
              <th className="py-2 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{supplier.name}</td>
                <td className="py-2 px-4">{supplier.email}</td>
                <td className="py-2 px-4">{supplier.phone}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(supplier, 'supplier')}
                    className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id, 'supplier')}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <Plus size={18} className="mr-2" />
        Add Supplier
      </button>

      {/* Similar modal structure for suppliers */}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="mb-4">
        {['users', 'products', 'suppliers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-2 px-4 py-2 rounded flex items-center ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab === 'users' && <Users className="mr-2" />}
            {tab === 'products' && <Package className="mr-2" />}
            {tab === 'suppliers' && <Truck className="mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'suppliers' && renderSuppliersTab()}
      </div>

      {/* Product Modal */}
      {isModalOpen && activeTab === 'products' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Product' : 'Add Product'}</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => editingId ? handleUpdate(e, 'product') : handleCreate(e, 'product')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={productForm.currentStock}
                    onChange={(e) => setProductForm({ ...productForm, currentStock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={productForm.reorderPoint}
                    onChange={(e) => setProductForm({ ...productForm, reorderPoint: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {isModalOpen && activeTab === 'suppliers' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => editingId ? handleUpdate(e, 'supplier') : handleCreate(e, 'supplier')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;