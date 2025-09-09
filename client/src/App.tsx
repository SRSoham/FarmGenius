import React from "react";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-200 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        🌾 Welcome to FarmGenius
      </h1>
      <p className="text-gray-700 mb-6 text-lg">
        AI-Powered Personal Farming Assistant for Kerala Farmers
      </p>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Get Started</h2>
        <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition">
          Explore Features
        </button>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} FarmGenius. All rights reserved.
      </footer>
    </div>
  );
}

export default App;

