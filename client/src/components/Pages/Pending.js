import React from 'react';
import { useNavigate } from 'react-router-dom';

const PendingPage = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-8">Account Pending Approval</h2>
      <p className="text-gray-700 mb-6">
        Your account is currently pending approval by an administrator.
        Please check back later or contact support if you have any questions.
      </p>
      <div className="flex justify-center mb-6">
</div>
<div className={"mt-10 mb-10"}><iframe src="https://giphy.com/embed/QBd2kLB5qDmysEXre9" width="100%" height="100%"   frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/time-mr-bean-look-at-the-QBd2kLB5qDmysEXre9"></a></p>
      <button
        onClick={handleRestart}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Restart
      </button>
    </div>
  );
};

export default PendingPage;
