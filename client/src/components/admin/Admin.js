import React, { useState } from 'react';
import ProductDAta from './productDisplay/ProductDisplay';
import ProductsUpload from './Products/ProductsUpload';
import axios from 'axios';
import Users from './users/Users';
import Dashboard from './Dashboard/Dashboard';
import UserManagement from './AllUsers/Users';
import { FaDatabase } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoCloudUploadSharp } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";

const handleLogout = () => {
  // Logout user when logout button is clicked
  axios.get('https://rrobotika.onrender.com/auth/google/logout', { withCredentials: true })
    .then(() => {
      window.location.href = '/'; // Redirect to home after logout
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
};

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-gray-950 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              Rrobotika
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen, activeItem, setActiveItem, toggleSidebar }) => {
  const menuItems = [
    {
      id: 1, name: 'Dashboard', icon: <MdDashboard size={23}/>

    },
    {
      id: 2, name: 'Reservations', icon: <FaUserFriends size={23} />

    },
    {
      id: 3, name: 'Product upload ', icon: <IoCloudUploadSharp size={23} />

    },
    {
      id: 4, name: 'Products data', icon:<FaDatabase size={23}/>

    
    },
    {
      id: 5, name: 'User Managment', icon:<RiAdminFill size={23} />

    
    },

    {
      id: 6, name: 'Sign Out', icon: <RiLogoutBoxFill size={23} />


    },
  ];

  const handleClick = (item) => {
    if (item.id === 6) {
      handleLogout();
    } else {
      setActiveItem(item.id);
    }
    toggleSidebar(); // Close sidebar after clicking any tab
  };

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto  dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <li key={item.id} className={item.id === activeItem ? '' : ''}>
              <a
                href="#"
                onClick={() => handleClick(item)}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${item.id === activeItem ? 'bg-gray-800' : ''}`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Users />;
      case 3:
        return <ProductsUpload />;
      case 4:
        return <ProductDAta />;
      case 5:
          return <UserManagement />;
  
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        toggleSidebar={toggleSidebar}
      />
      <div className={`pt-20 sm:ml-64 ${isOpen ? "": ''}`}> {/* Blurred when sidebar is open */}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Home;
