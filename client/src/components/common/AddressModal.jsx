import React from "react";
import { X, MapPin } from "lucide-react";

const ADDRESS_TYPES = [
  { label: "Home", icon: <span role="img" aria-label="Home">🏠</span> },
  { label: "Work", icon: <span role="img" aria-label="Work">🏢</span> },
  { label: "Hotel", icon: <span role="img" aria-label="Hotel">🏨</span> },
  { label: "Other", icon: <span role="img" aria-label="Other">🏷️</span> },
];

export default function AddressModal({ isOpen, onClose, onSave }) {
  const [addressType, setAddressType] = React.useState("Home");
  const [flat, setFlat] = React.useState("");
  const [floor, setFloor] = React.useState("");
  const [area, setArea] = React.useState("");
  const [landmark, setLandmark] = React.useState("");
  const [detecting, setDetecting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDetectLocation = async () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Call backend route to avoid CORS
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/location?lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) throw new Error("Failed to fetch address");
          const data = await response.json();
          setArea(
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state ||
            data.display_name || ""
          );
          setFlat("");
          setFloor("");
          setLandmark("");
        } catch (err) {
          alert("Failed to detect address. Please try again.");
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        alert(error.message || "Failed to get your location. Please allow location access.");
        setDetecting(false);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-60 p-4" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Enter complete address</h2>
            <button
              onClick={onClose}
              className="text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Address type selector */}
          <div className="flex gap-2 mb-4">
            {ADDRESS_TYPES.map(type => (
              <button
                key={type.label}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border font-semibold text-sm transition-all ${addressType === type.label ? "bg-green-100 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-600"}`}
                onClick={() => setAddressType(type.label)}
                type="button"
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
          {/* Detect location button */}
          <button
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold hover:bg-green-100 transition disabled:opacity-60"
            onClick={handleDetectLocation}
            disabled={detecting}
            type="button"
          >
            <MapPin className="w-5 h-5" /> {detecting ? "Detecting..." : "Detect my location"}
          </button>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              placeholder="Flat / House no / Building name"
              value={flat}
              onChange={e => setFlat(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              placeholder="Floor (optional)"
              value={floor}
              onChange={e => setFloor(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              placeholder="Area / Sector / Locality"
              value={area}
              onChange={e => setArea(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
              placeholder="Nearby landmark (optional)"
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
            />
            <button
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => onSave({
                label: addressType,
                flat,
                floor,
                area,
                landmark
              })}
            >Save Address</button>
          </div>
        </div>
      </div>
    </>
  );
} 