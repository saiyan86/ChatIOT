const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Example machine data. In a real scenario, this would
// be fetched from Shifu-connected machines or a database.
const machines = [
  {
    id: 'machine-1',
    name: 'Conveyor Motor',
    status: 'online',
    location: 'Factory Floor',
    lastUpdated: '2025-05-23T09:45:00Z',
    dataPoints: [
      { label: 'Temperature', value: 73, unit: '°C' },
      { label: 'Vibration', value: 0.12, unit: 'mm/s' },
      { label: 'RPM', value: 1500, unit: 'rpm' }
    ]
  },
  {
    id: 'machine-2',
    name: 'Packaging Robot',
    status: 'maintenance',
    location: 'Factory Floor',
    lastUpdated: '2025-05-21T15:00:00Z',
    dataPoints: [
      { label: 'Temperature', value: 60, unit: '°C' },
      { label: 'Load', value: 80, unit: '%' },
      { label: 'Cycle Count', value: 12000, unit: '' }
    ]
  },
  {
    id: 'machine-3',
    name: 'Hydraulic Press',
    status: 'offline',
    location: 'Workshop',
    lastUpdated: '2025-05-22T18:30:00Z',
    dataPoints: [
      { label: 'Pressure', value: 101.3, unit: 'bar' },
      { label: 'Temperature', value: 45, unit: '°C' },
      { label: 'Oil Level', value: 70, unit: '%' }
    ]
  }
];

// Endpoint to provide machine data
app.get('/api/machines', (req, res) => {
  res.json(machines);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
