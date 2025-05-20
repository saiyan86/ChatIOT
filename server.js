const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Example device data. In a real scenario, this would
// be fetched from Shifu-connected devices or a database.
const devices = [
  { id: 'sensor-1', status: 'online', value: 42 },
  { id: 'sensor-2', status: 'offline', value: null },
  { id: 'machine-1', status: 'online', value: 73 },
];

// Endpoint to provide device data
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
