import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingCart, Heart } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              StyleSwap
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Show Cart and Wishlist only if the user is logged in */}
                <Link
                  to="/cart"
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <ShoppingCart className="w-5 h-5 mr-1" />
                  Cart
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <Heart className="w-5 h-5 mr-1" />
                  Wishlist
                </Link>

                {/* Profile and Logout links */}
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <User className="w-5 h-5 mr-1" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Only show Login and Register links if the user is not logged in */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
