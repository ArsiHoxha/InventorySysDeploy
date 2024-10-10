import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from '../User/UserProfile';
import Admin from '../admin/Admin';
import { useNavigate } from "react-router-dom";
const UserOrAdmin = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data when component mounts
        axios.get('http://localhost:5000/auth/google/success', { withCredentials: true })
            .then(response => {
                const { data } = response;
                if (data) {
                    setUser(data);  
                } else {
                    // If data is null, redirect to home
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.log('Error fetching user data:', error);
                window.location.href = '/'; // Redirect to home after logout

            })
                        .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        navigate("/");

    }

    return (
        <div>
            {user && user.isAdmin ? (
                <Admin />
            ) : (
                <UserProfile userId={user.googleId} />
            )}
        </div>
    );
};

export default UserOrAdmin;
