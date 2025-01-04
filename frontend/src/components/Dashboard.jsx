import React, { useState, useEffect } from 'react';
import { LogOut, Users, Package, Truck, BarChart2, ClipboardList, Home } from 'lucide-react';
import AdminPage from './AdminPage';
import ManagerPage from './ManagerPage';
import StaffPage from './StaffPage';
import { getProducts } from './services/api';

const Dashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('overview');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderBreadcrumbs = () => (
    <nav className="text-sm breadcrumbs">
      <ul className="flex">
        <li><a href="#" onClick={() => setActivePage('overview')} className="text-blue-500 hover:text-blue-700">Home</a></li>
        <li className="mx-2">/</li>
        <li>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</li>
      </ul>
    </nav>
  );

  const renderTopNavBar = () => (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-blue-500" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="#"
                onClick={() => setActivePage('overview')}
                className={`${
                  activePage === 'overview'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Overview
              </a>
              {user.role === 'ADMIN' && (
                <>
                  <a
                    href="#"
                    onClick={() => setActivePage('users')}
                    className={`${
                      activePage === 'users'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Users
                  </a>
                  <a
                    href="#"
                    onClick={() => setActivePage('products')}
                    className={`${
                      activePage === 'products'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Products
                  </a>
                  <a
                    href="#"
                    onClick={() => setActivePage('suppliers')}
                    className={`${
                      activePage === 'suppliers'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Suppliers
                  </a>
                  <a
                    href="#"
                    onClick={() => setActivePage('stock')}
                    className={`${
                      activePage === 'stock'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Stock
                  </a>
                </>
              )}
              {user.role === 'MANAGER' && (
                <>
                  <a
                    href="#"
                    onClick={() => setActivePage('products')}
                    className={`${
                      activePage === 'products'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Products
                  </a>
                  <a
                    href="#"
                    onClick={() => setActivePage('suppliers')}
                    className={`${
                      activePage === 'suppliers'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Suppliers
                  </a>
                  <a
                    href="#"
                    onClick={() => setActivePage('transactions')}
                    className={`${
                      activePage === 'transactions'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Transactions
                  </a>
                </>
              )}
              {user.role === 'STAFF' && (
                <>
                  <a
                    href="#"
                    onClick={() => setActivePage('stock')}
                    className={`${
                      activePage === 'stock'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Stock
                  </a>
                  <a
                    href="#"
                    onClick={() => setActivePage('transactions')}
                    className={`${
                      activePage === 'transactions'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Transactions
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={onLogout}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderContent = () => {
    switch (user.role) {
      case 'ADMIN':
        return <AdminPage products={products} />;
      case 'MANAGER':
        return <ManagerPage products={products} />;
      case 'STAFF':
        return <StaffPage products={products} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderTopNavBar()}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderBreadcrumbs()}
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h1>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

