import React, { useState } from 'react';
import { BarChart2, Plus, Minus, RefreshCw } from 'lucide-react';

const StaffPage = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Router X1', stock: 150, category: 'Networking' },
    { id: 2, name: 'Switch Y2', stock: 75, category: 'Networking' },
    { id: 3, name: 'Fiber Optic Cable', stock: 500, category: 'Cabling' },
    { id: 4, name: 'Wireless Access Point', stock: 100, category: 'Wireless' },
    { id: 5, name: 'VoIP Phone', stock: 200, category: 'Telephony' },
  ]);

  const [transactionType, setTransactionType] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleTransaction = (e) => {
    e.preventDefault();
    const updatedProducts = products.map(product => {
      if (product.id === parseInt(selectedProduct)) {
        return {
          ...product,
          stock: transactionType === 'add' 
            ? product.stock + parseInt(quantity)
            : Math.max(0, product.stock - parseInt(quantity))
        };
      }
      return product;
    });
    setProducts(updatedProducts);
    setSelectedProduct('');
    setQuantity(0);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BarChart2 className="mr-2" />
          Product Stock
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Product Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <RefreshCw className="mr-2" />
          Perform Stock Transaction
        </h2>
        <form onSubmit={handleTransaction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionType">
              Transaction Type
            </label>
            <div className="flex">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  className="form-radio"
                  name="transactionType"
                  value="add"
                  checked={transactionType === 'add'}
                  onChange={() => setTransactionType('add')}
                />
                <span className="ml-2">Add Stock</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="transactionType"
                  value="remove"
                  checked={transactionType === 'remove'}
                  onChange={() => setTransactionType('remove')}
                />
                <span className="ml-2">Remove Stock</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">
              Select Product
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              type="submit"
            >
              {transactionType === 'add' ? (
                <>
                  <Plus className="mr-2" size={16} />
                  Add Stock
                </>
              ) : (
                <>
                  <Minus className="mr-2" size={16} />
                  Remove Stock
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffPage;

