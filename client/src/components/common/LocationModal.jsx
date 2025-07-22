import React from "react";
import { MapPin, X } from "lucide-react";
import useStore from "../../store/useStore";

export default function LocationModal() {
  const {
    isLocationModalOpen,
    setLocationModalOpen,
    currentLocation,
    setCurrentLocation,
  } = useStore();
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [locationError, setLocationError] = React.useState("");

  const handleDetectLocation = async () => {
    setLocationLoading(true);
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `http://localhost:5000/api/location?lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) throw new Error("Failed to fetch address");
          const data = await response.json();
          let address = data.display_name;
          if (data.address) {
            address =
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              data.display_name;
            if (data.address.city && data.address.state) {
              address = `${data.address.city}, ${data.address.state}`;
            } else if (data.address.town && data.address.state) {
              address = `${data.address.town}, ${data.address.state}`;
            } else if (data.address.village && data.address.state) {
              address = `${data.address.village}, ${data.address.state}`;
            }
          }
          setCurrentLocation(address);
          setLocationModalOpen(false);
        } catch (err) {
          setLocationError("Failed to detect address. Please try again.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationError(
          error.message || "Failed to get your location. Please allow location access."
        );
        setLocationLoading(false);
      }
    );
  };

  if (!isLocationModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600/50 z-40 transition-opacity duration-300"
        onClick={() => setLocationModalOpen(false)}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Change Location
            </h2>
            <button
              onClick={() => setLocationModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDetectLocation}
              className={`w-full flex items-center justify-center bg-green-500 text-white py-3 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${locationLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600'}`}
              disabled={locationLoading}
            >
              <MapPin className="w-5 h-5 mr-2" />
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Detecting...
                </>
              ) : (
                'Detect my location'
              )}
            </button>
            {locationError && (
              <div className="text-red-600 text-sm text-center">{locationError}</div>
            )}
            {currentLocation && currentLocation !== 'Select location' && (
              <div className="text-green-700 text-center text-sm font-medium border border-green-100 bg-green-50 rounded-lg p-3">
                Detected Address: {currentLocation}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 