import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('https://inventorysysdeploy-2.onrender.com/reservations',{withCredentials:true});
                setReservations(response.data);
                setFilteredReservations(response.data); // Initialize filtered reservations with all reservations
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchReservations();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterReservations(e.target.value); // Call filter function whenever search term changes
    };

    const filterReservations = (term) => {
        if (!term.trim()) {
            setFilteredReservations(reservations); // Reset to all reservations if search term is empty
        } else {
            const filtered = reservations.filter(reservation => 
                reservation.userDisplayName && // Check if userDisplayName exists
                reservation.userDisplayName.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredReservations(filtered);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Reservations</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by User Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                />
            </div>

            {loading ? ( // Display loading indicator if loading is true
                <div className="flex justify-center items-center h-64">
                    <div className="text-blue-500 text-xl">Loading...</div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                        <thead className="bg-gray-200 sticky top-0">
                            <tr>
                                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Product Name</th>
                                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">User Name</th>
                                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Reserved At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation, index) => (
                                <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <td className="py-3 px-6 border-b border-gray-300 text-sm">{reservation.productNameTxt}</td>
                                    <td className="py-3 px-6 border-b border-gray-300 text-sm">{reservation.userDisplayName}</td>
                                    <td className="py-3 px-6 border-b border-gray-300 text-sm">{new Date(reservation.reservedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
