const fetch = require('node-fetch');

exports.getLocation = async (req, res) => {
  const { lat, lon } = req.query;
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch location data');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 