import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserOrAdmin from './components/UserOrAdminSelection/UserOrAdminSelection';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('https://inventorysysdeploy-2.onrender.com/auth/google/success', { withCredentials: true });
        setUser(res.data);
        if (res.data) {
          navigate('/profile');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogin = () => {
    const googleAuthURL = 'https://inventorysysdeploy-2.onrender.com/auth/google';
    window.open(googleAuthURL, '_self');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
<header className="w-full bg-gray-850 border-b border-gray-700 shadow-lg py-2 text-white text-center">
  <h1 className="text-2xl font-bold text-gray-100">Harry Fultz Robotics Inventory</h1>
</header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 space-y-2">
        {!user ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-md text-center text-gray-300">
              Reserve robotics equipment and stay organized for your projects.
            </p>
            <button
              onClick={handleLogin}
              className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-xs font-medium text-white hover:bg-gray-700 focus:outline-none"
              aria-label="Continue with Google"
            >
              <svg
                className="h-5 w-5 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="-0.5 0 48 48"
                version="1.1"
              >
                <title>Google-color</title>
                <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Color-" transform="translate(-401.000000, -860.000000)">
                    <g id="Google" transform="translate(401.000000, 860.000000)">
                      <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" fill="#FBBC05"></path>
                      <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" fill="#EB4335"></path>
                      <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" fill="#34A853"></path>
                      <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" fill="#4285F4"></path>
                    </g>
                  </g>
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
            <p className="text-xs text-center text-gray-500 max-w-xs">
              <strong>Note for iOS users:</strong> If you’re using Safari, go to <strong>Settings &gt; Safari &gt; Privacy &amp; Security</strong> and disable <em>Prevent Cross-Site Tracking</em>. This will allow the app to authenticate properly.
            </p>
          </div>
        ) : (
          <UserOrAdmin user={user} />
        )}
      </main>
      <footer className="w-full bg-gray-900 py-2 text-center text-gray-400 font-bold">
        <p className="text-xs">&copy; {new Date().getFullYear()} Rrobotika Hf. All rights reserved.</p>
        <p className="text-xs mt-1">Programmed by Arsi Hoxha | Hosted by Arben Kryemadhi</p>
      </footer>
    </div>
  );
}

export default App;
