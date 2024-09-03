import React from 'react';
import './NotAllowedMessage.css'; // Create a CSS file for styling

const NotAllowedMessage = () => {
  console.log("notAllowed");
  return (
    <div className="not-allowed-container">
      <h2>You are not allowed for this section</h2>
    </div>
  );
};

export default NotAllowedMessage;