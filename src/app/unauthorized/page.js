import React from "react";

const Unauthorized = () => {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
        <a href="/" className="text-blue-500 underline">Go to Homepage</a>
      </div>
    );
  };
  
  export default Unauthorized;