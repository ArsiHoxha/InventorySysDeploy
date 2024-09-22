import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [lowestPriceProduct, setLowestPriceProduct] = useState(null);
  const [highestPriceProduct, setHighestPriceProduct] = useState(null);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);

  useEffect(() => {
    fetchProductsPrice();
    fetchTotalUsersCount();
    fetchMostActiveUsers();
  }, []);

  const fetchProductsPrice = async () => {
    try {
      const response = await axios.get('https://inventorysysdeploy-1.onrender.com/productsPrice');
      setProducts(response.data.products);
      setLowestPriceProduct(response.data.lowestPriceProduct);
      setHighestPriceProduct(response.data.highestPriceProduct);
    } catch (error) {
      console.error('Error fetching product prices:', error);
    }
  };

  const fetchTotalUsersCount = async () => {
    try {
      const response = await axios.get('https://inventorysysdeploy-1.onrender.com/totalUsersCount');
      setTotalUsersCount(response.data.totalUsersCount);
    } catch (error) {
      console.error('Error fetching total users count:', error);
    }
  };

  const fetchMostActiveUsers = async () => {
    try {
      const response = await axios.get('https://inventorysysdeploy-1.onrender.com/mostActiveUsers');
      setMostActiveUsers(response.data);
    } catch (error) {
      console.error('Error fetching most active users:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Paneli i Inventarit</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Produkti me sasinë më të ulët</h3>
        {lowestPriceProduct && (
          <div className="bg-red-100 p-4 rounded-md mb-4">
            <p className="font-medium">Emri: {lowestPriceProduct.productNameTxt}</p>
            <p className="font-medium">Sasia: {lowestPriceProduct.priceTxt}</p>
            <p className="font-medium">Përshkrimi: {lowestPriceProduct.descriptionTxt}</p>
          </div>
        )}
        <h3 className="text-xl font-semibold mb-4">Produkti me sasinë më të lartë</h3>
        {highestPriceProduct && (
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <p className="font-medium">Emri: {highestPriceProduct.productNameTxt}</p>
            <p className="font-medium">Sasia: {highestPriceProduct.priceTxt}</p>
            <p className="font-medium">Përshkrimi: {highestPriceProduct.descriptionTxt}</p>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Numri total i përdoruesve</h3>
        <div className="bg-blue-100 p-4 rounded-md mb-4">
          <p className="font-medium">Numri total i përdoruesve: {totalUsersCount}</p>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};

export default Dashboard;
