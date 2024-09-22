
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTable = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get('https://inventorysysdeploy-1.onrender.com/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
    }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    axios.get('https://inventorysysdeploy-1.onrender.com/auth/google/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/'; // Redirect to home after logout
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  const handleRezervoClick = (productId) => {
    if (window.confirm('Are you sure you want to reserve this product?')) {
      axios.post('https://inventorysysdeploy-1.onrender.com/reserve', { productId, userId },{withCredentials:true})
        .then(response => {
          // Update the product quantity in the UI
          setProducts(products.map(product =>
            product._id === productId ? { ...product, quantity: product.quantity - 1 } : product
          ));
          setSuccessMessage('Your reservation was successful.');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000); // Clear message after 3 seconds
        })
        .catch(error => {
          console.error('Error reserving product:', error);
        });
    }
  };

  const filteredProducts = products.filter(product =>
    product.productNameTxt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descriptionTxt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-700">
      <header className="bg-gray-800 py-4 text-white text-center flex justify-around">
        <h1 className="text-3xl font-bold">Rrobotika Hf</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </header>
      <main className="flex-1 p-1">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          />
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
              {successMessage}
            </div>
          )}
          {filteredProducts.length === 0 ? (
            <p className="text-center mt-8 text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 m-0; sm:grid-cols-1 md:grid-cols-6 gap-4">
              {filteredProducts.map((product, index) => (
                <div key={index} className="bg-white  overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={`https://inventorysysdeploy-1.onrender.com/uploads/${product.filename}`}
                    alt={product.productNameTxt}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{product.productNameTxt}</h2>
                    <p className="text-gray-700 dark:text-gray-900">{product.descriptionTxt}</p>
                    <p className="mt-2 font-bold">Quantity: {product.priceTxt}</p>
                    <button
                      onClick={() => handleRezervoClick(product._id)}
                      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Get the product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="w-full bg-gray-800 py-4 text-center text-white font-bold">
        <p>&copy; {new Date().getFullYear()} Rrobotika Hf. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductTable;
