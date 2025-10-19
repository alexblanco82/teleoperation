import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ConnectionCard from '../components/ConnectionCard';
import JoystickControl from '../components/JoystickControl';
import StatusCard from '../components/StatusCard';
import CameraFeed from '../components/CameraFeed';
import { mockCameras } from '../mock/data';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [rosbridgeUrl, setRosbridgeUrl] = useState('wss://monitor.bot-ix.com/rosbridge');
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  const handleConnect = () => {
    // Mock connection
    setConnectionStatus('Connecting...');
    setTimeout(() => {
      setConnectionStatus('Connected');
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnectionStatus('Disconnected');
  };

  const handleJoystickMove = (x, y) => {
    setJoystickPosition({ x, y });
  };

  return (
    <div className="dashboard">
      <Header />
      
      <main className="dashboard-main">
        {/* Connection Settings */}
        <ConnectionCard 
          rosbridgeUrl={rosbridgeUrl}
          setRosbridgeUrl={setRosbridgeUrl}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={connectionStatus === 'Connected'}
        />

        {/* Control Row */}
        <div className="control-row">
          <JoystickControl 
            onMove={handleJoystickMove}
            isConnected={connectionStatus === 'Connected'}
          />
          <StatusCard 
            status={connectionStatus}
            joystickPosition={joystickPosition}
          />
        </div>

        {/* Camera Grid */}
        <div className="camera-grid">
          <div className="camera-row">
            <CameraFeed 
              title="Front Camera"
              stream={mockCameras.front}
              topic="/usb_front/usb_cam/image_raw"
            />
            <CameraFeed 
              title="Rear Camera"
              stream={mockCameras.back}
              topic="/usb_back/usb_cam/image_raw"
            />
          </div>
          
          <div className="camera-row">
            <CameraFeed 
              title="Left Camera"
              stream={mockCameras.left}
              topic="/usb_left/usb_cam/image_raw"
            />
            <CameraFeed 
              title="Right Camera"
              stream={mockCameras.right}
              topic="/usb_right/usb_cam/image_raw"
            />
          </div>

          <div className="camera-full">
            <CameraFeed 
              title="Internal Camera"
              stream={mockCameras.internal}
              topic="/usb_internal/usb_cam/image_raw"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;