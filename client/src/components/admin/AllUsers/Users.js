import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/blockUser/${userId}`);
      fetchUsers();  // Refresh the user list
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/unblockUser/${userId}`);
      fetchUsers();  // Refresh the user list
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/approveUser/${userId}`);
      fetchUsers();  // Refresh the user list
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/rejectUser/${userId}`);
      fetchUsers();  // Refresh the user list
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleDeleteAllUsers = async () => {
    // Confirm the action
    const confirmDelete = window.confirm(
      'Are you sure you want to delete all users? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        await axios.delete('http://localhost:5000/deleteAllUsers');
        setUsers([]); // Clear the local state
      } catch (error) {
        console.error('Error deleting all users:', error);
      }
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-8">User Management</h2>
      
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Delete All Users Button */}
      <div className="mb-4 text-center">
        <button
          onClick={handleDeleteAllUsers}
          className="px-4 py-2 w-full bg-red-500 text-white font-semibold rounded hover:bg-red-600"
        >
          Delete All Users
        </button>
      </div>

      {/* Responsive User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 md:px-6 text-left font-medium text-gray-700">Name</th>
              <th className="py-3 px-4 md:px-6 text-left font-medium text-gray-700">Email</th>
              <th className="py-3 px-4 md:px-6 text-left font-medium text-gray-700">Status</th>
              <th className="py-3 px-4 md:px-6 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="py-3 px-4 md:px-6 border-b">{user.displayName}</td>
                <td className="py-3 px-4 md:px-6 border-b">{user.email}</td>
                <td className="py-3 px-4 md:px-6 border-b">
                  {user.blocked ? 'Blocked' : user.pending ? 'Pending Approval' : 'Active'}
                </td>
                <td className="py-3 px-4 md:px-6 border-b text-center">
                  {user.blocked ? (
                    <button
                      onClick={() => handleUnblockUser(user._id)}
                      className="text-blue-500 hover:underline"
                    >
                      Unblock
                    </button>
                  ) : user.pending ? (
                    <>
                      <button
                        onClick={() => handleApproveUser(user._id)}
                        className="text-green-500 hover:underline mr-2 md:mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectUser(user._id)}
                        className="text-red-500 hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(user._id)}
                      className="text-red-500 hover:underline"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
