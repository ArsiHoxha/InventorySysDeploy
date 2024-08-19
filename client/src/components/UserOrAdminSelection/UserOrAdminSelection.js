import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from '../User/UserProfile';
import Admin from '../admin/Admin';

const UserOrAdmin = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data when component mounts
        axios.get('https://inventorysysdeploy.onrender.com/auth/google/success', { withCredentials: true })
            .then(response => {
                const { data } = response;
                if (data) {
                    setUser(data);
                    console.log('User data:', data);
                } else {
                    // If data is null, redirect to home
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.log('Error fetching user data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <a href="https://inventorysysdeploy.onrender.com/auth/google">Authenticate with Google</a>;
    }

    return (
        <div>
            {user.isAdmin ? (
                <Admin />
            ) : (
                <UserProfile userId={user.googleId} />
            )}
        </div>
    );
};

export default UserOrAdmin;
