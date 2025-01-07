import { User, Trophy, Swords } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileDashboard() {
  // State for tracking if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };


  const handleLogout = () => {
    // Simulate logging out
    setIsLoggedIn(false);
  };

  return (
    <div
      className={clsx(
        "bg-gray-800 p-6 rounded-lg overflow-hidden shadow-lg h-full flex flex-col space-y-6 relative ",
        {
          "cursor-pointer hover:scale-105 duration-200": isLoggedIn, // Hover effect is applied only if logged in
          "cursor-default": !isLoggedIn, // Disable pointer cursor when not logged in
        }
      )}
    >
      {/* Conditional rendering based on login status */}
      {isLoggedIn ? (
        // Profile Section for logged-in user
        <div className="flex  items-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mr-4">
            <User size={40} className="text-gray-300" aria-label="User Icon" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-100">John Doe</h3>
            <div className="flex items-center text-yellow-500">
              {/* Replace name with icons of different leagues */}
              <Trophy size={16} className="mr-2" aria-label="Trophy Icon" />
              <Swords size={16} className="mr-2" aria-label="Swords Icon" />
              <Trophy size={16} className="mr-2" aria-label="Another Trophy Icon" />
            </div>
          </div>
          <button onClick={handleLogout} className="bg-[#964242] hover:bg-[#b93b3b] absolute right-0 top-0 bottom-0 h-full text-5xl flex items-center justify-center ">
            ⇲
          </button>
        </div>
      ) : (
        // Button for logging in with Google if not logged in
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            <img src="https://icon2.cleanpng.com/20181108/wls/kisspng-youtube-google-logo-google-images-google-account-consulting-crm-the-1-recommended-crm-for-g-suite-1713925039962.webp" className="w-6 h-6 mr-3" alt="Google Logo" />
            <span className="font-semibold text-lg">Login with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}