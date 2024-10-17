import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductData = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editProduct, setEditProduct] = useState(null); // State to track the product being edited
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");

  useEffect(() => {
    axios.get('https://inventorysysdeploy-2.onrender.com/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(err => {
        
        console.log(err);
      });
  }, []);

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      axios.delete(`https://inventorysysdeploy-2.onrender.com/products/${productId}`)
        .then(response => {
          setProducts(products.filter(product => product._id !== productId));
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.priceTxt - b.priceTxt;
    } else {
      return b.priceTxt - a.priceTxt;
    }
  });

  const filteredProducts = sortedProducts.filter(product =>
    product.productNameTxt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditProduct(product);
    setUpdatedName(product.productNameTxt);
    setUpdatedDescription(product.descriptionTxt);
    setUpdatedPrice(product.priceTxt);
  };

  const handleUpdate = (productId) => {
    axios.put(`https://inventorysysdeploy-2.onrender.com/products/${productId}`, {
      productNameTxt: updatedName,
      descriptionTxt: updatedDescription,
      priceTxt: updatedPrice,
    })
      .then(response => {
        const updatedProducts = products.map(product =>
          product._id === productId ? response.data : product
        );
        setProducts(updatedProducts);
        setEditProduct(null); // Close the pop-up
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          className="font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={handleSort}
        >
          Sort by Number ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
        
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Image</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Title</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Description</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Number</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <img className="h-16 w-16 object-cover rounded" src={`https://inventorysysdeploy-2.onrender.com/uploads/${product.productImg}`} alt={product.productNameTxt} />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{product.productNameTxt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{product.descriptionTxt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{product.priceTxt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        className="font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="font-bold bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-6 text-lg text-gray-500">No products available.</p>
        )}

        {editProduct && (
          // Pop-up Modal
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                placeholder="Product Name"
                className="w-full p-2 mb-4 border rounded"
              />
              <textarea
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
                placeholder="Quantity"
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="font-bold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleUpdate(editProduct._id)}
                >
                  Update
                </button>
                <button
                  className="font-bold bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductData;
