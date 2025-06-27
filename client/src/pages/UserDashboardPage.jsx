import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

const UserDashboardPage = ({ navigate }) => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate("login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleEditProfile = async () => {
    console.log(
      "Simulating edit profile. In a full app, this would be a form."
    );
    try {
      // Example: update just the phone number directly from here for demo
      // await updateUserProfile({ phone: '123-456-7890' });
      // console.log('Profile update simulated successfully.');
    } catch (error) {
      console.error("Failed to simulate profile update:", error);
    }
    alert("Edit Profile functionality would go here! This is a placeholder.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Account
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            Profile Information
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Address:</span>{" "}
              {user.address || "Not set"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone || "Not set"}
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            Account Actions
          </h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate("orderHistory")}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              My Orders
            </button>
            <button
              onClick={handleEditProfile}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
