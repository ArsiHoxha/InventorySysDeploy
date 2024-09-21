import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductTable from './userProfileComponents/UserData/UserData';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState({}); // Initialize user as an empty object

  const handleLogout = () => {
    axios.get('https://rrobotika.onrender.com/auth/google/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/'; // Redirect to home after logout
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  const fetchUser = async () => {
    try {
      if (userId) {
        const response = await axios.get(`https://rrobotika.onrender.com/getUserInfo/${userId}`, { withCredentials: true });
        setUser(response.data); // Set the fetched user data
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]); // Fetch user information when userId changes

  return (
    <>
        <ProductTable userId={user.googleId} />
    </>
  );
};

export default UserProfile;
