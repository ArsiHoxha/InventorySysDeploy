import React, { useState } from 'react';
import axios from 'axios';

export default function ProductsUpload() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageProfile, setImageProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (setter) => (e) => setter(e.target.value);
  const handleImageProductChange = (e) => setImageProfile(e.target.files[0]);

  const handlePostProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!productName || !price || !description || !category || !imageProfile) {
      setError('All fields are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category); // Include category in form data
      formData.append('file', imageProfile);

      const response = await axios.post(
        'https://inventorysysdeploy-2.onrender.com/uploadProduct',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setSuccess('Product uploaded successfully.');
        // Clear the form
        setProductName('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImageProfile(null);
      }
    } catch (error) {
      setError(
        error.response ? error.response.data.message : 'Error uploading product.'
      );
    }
  };

  return (
    <form
      className="mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handlePostProduct}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="productName"
        >
          Product Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="productName"
          type="text"
          placeholder="Enter product name"
          value={productName}
          onChange={handleInputChange(setProductName)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Quantity
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="price"
          type="text"
          placeholder="Enter quantity"
          value={price}
          onChange={handleInputChange(setPrice)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          placeholder="Enter product description"
          value={description}
          onChange={handleInputChange(setDescription)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="category"
        >
          Category
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          type="text"
          placeholder="Enter product category"
          value={category}
          onChange={handleInputChange(setCategory)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Product Image
        </label>
        <input
          type="file"
          id="image"
          name="file"
          accept="image/*"
          onChange={handleImageProductChange}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {success && <p className="text-green-500 text-xs italic">{success}</p>}
      <div className="flex items-center justify-between mt-3">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create Product
        </button>
      </div>
    </form>
  );
}
