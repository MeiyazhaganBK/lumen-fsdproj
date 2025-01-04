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
  const [error, setError] = useState('');

  const initialUserForm = { name: '', email: '', password: '', role: 'STAFF' };
  const initialProductForm = { 
    name: '', 
    description: '', 
    categoryId: '', 
    price: '', 
    currentStock: '', 
    reorderPoint: '', 
    sku: '' 
  };
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
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setUserForm(initialUserForm);
    setProductForm(initialProductForm);
    setSupplierForm(initialSupplierForm);
    setError('');
  };

  const prepareProductData = (data) => {
    return {
      ...data,
      categoryId: parseInt(data.categoryId),
      price: parseFloat(data.price),
      currentStock: parseInt(data.currentStock),
      reorderPoint: parseInt(data.reorderPoint)
    };
  };

  const handleCreate = async (e, type) => {
    e.preventDefault();
    setError('');
    try {
      if (type === 'user') {
        await createUser(userForm);
      } else if (type === 'product') {
        const preparedData = prepareProductData(productForm);
        await createProduct(preparedData);
      } else if (type === 'supplier') {
        await createSupplier(supplierForm);
      }
      
      handleModalClose();
      fetchData();
    } catch (error) {
      setError(`Error creating ${type}: ${error.message}`);
      console.error(`Error creating ${type}:`, error);
    }
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    setError('');
    try {
      if (type === 'user') {
        await updateUser(editingId, userForm);
      } else if (type === 'product') {
        const preparedData = prepareProductData(productForm);
        await updateProduct(editingId, preparedData);
      } else if (type === 'supplier') {
        await updateSupplier(editingId, supplierForm);
      }
      
      handleModalClose();
      fetchData();
    } catch (error) {
      setError(`Error updating ${type}: ${error.message}`);
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      if (type === 'user') await deleteUser(id);
      if (type === 'product') await deleteProduct(id);
      if (type === 'supplier') await deleteSupplier(id);
      
      fetchData();
    } catch (error) {
      setError(`Error deleting ${type}: ${error.message}`);
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleEdit = (item, type) => {
    setEditingId(item.id);
    if (type === 'user') {
      setUserForm({ ...item, password: '' });
    } else if (type === 'product') {
      setProductForm({
        ...item,
        categoryId: item.category.id.toString(),
        price: item.price.toString(),
        currentStock: item.currentStock.toString(),
        reorderPoint: item.reorderPoint.toString()
      });
    } else if (type === 'supplier') {
      setSupplierForm(item);
    }
    setIsModalOpen(true);
  };

  // Table component for reusability
  const Table = ({ headers, data, renderRow }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );

  const renderUsersTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
      <Table
        headers={['Name', 'Email', 'Role', 'Actions']}
        data={users}
        renderRow={(user) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(user, 'user')} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(user.id, 'user')} className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center shadow-sm"
      >
        <Plus size={18} className="mr-2" />
        Add User
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit User' : 'Add User'}</h3>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingId ? 'Password (leave blank to keep current)' : 'Password'}
                </label>
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
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Similar enhancements for renderProductsTab and renderSuppliersTab...
  // (The full code for these sections would follow the same pattern with the Table component)
  const renderProductsTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Products</h3>
      <Table
        headers={['Name', 'Category', 'Price', 'Stock', 'Actions']}
        data={products}
        renderRow={(product) => (
          <tr key={product.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {product.category.name}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">${Number(product.price).toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${product.currentStock <= product.reorderPoint 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'}`}>
                {product.currentStock}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(product, 'product')} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(product.id, 'product')} className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center shadow-sm"
      >
        <Plus size={18} className="mr-2" />
        Add Product
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

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
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
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
                    min="0"
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
                    min="0"
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
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSuppliersTab = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Suppliers</h3>
      <Table
        headers={['Name', 'Email', 'Phone', 'Actions']}
        data={suppliers}
        renderRow={(supplier) => (
          <tr key={supplier.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap font-medium">{supplier.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{supplier.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{supplier.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(supplier, 'supplier')} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(supplier.id, 'supplier')} className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center shadow-sm"
      >
        <Plus size={18} className="mr-2" />
        Add Supplier
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

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
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Update Supplier' : 'Create Supplier'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="mb-6 flex space-x-4">
        {[
          { id: 'users', icon: Users, label: 'Users' },
          { id: 'products', icon: Package, label: 'Products' },
          { id: 'suppliers', icon: Truck, label: 'Suppliers' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              activeTab === id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="mr-2 h-5 w-5" />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'suppliers' && renderSuppliersTab()}
      </div>
    </div>
  );
};

export default AdminPage;