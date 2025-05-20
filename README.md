# Chat IoT Dashboard

This project provides a simple dashboard with a chat side panel for Operational Technology (OT) managers. It demonstrates how device data from the [Shifu](https://github.com/Edgenesis/shifu) project could be presented alongside a chat interface.

## Features

- Displays device data fetched from an API endpoint.
- Includes a basic chat panel for user communication.
- Built with Node.js, Express, and plain HTML/CSS/JS.

## Running the Project

1. Install dependencies (requires Node.js):
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser to view the dashboard.

The server serves static files from the `public` directory and exposes `/api/devices` which returns example device data. Replace the placeholder data in `server.js` with real data from your Shifu-connected devices.
