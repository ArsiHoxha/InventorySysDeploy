import React from 'react';

const BlockedUser = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-red-500 mb-8">Account Blocked</h2>
      <p className="text-center text-lg">
        Your account has been blocked. Please contact support if you believe this is a mistake.
      </p>
      <div className="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/cRsMvsBkz0cRuGEn7m" width="100%" height="100%"  frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/nope-rex-lizard-party-cRsMvsBkz0cRuGEn7m"></a></p>

    </div>
  );
};

export default BlockedUser;
