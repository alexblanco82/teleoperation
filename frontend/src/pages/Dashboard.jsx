import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ConnectionCard from '../components/ConnectionCard';
import RobotSelector from '../components/RobotSelector';
import JoystickControl from '../components/JoystickControl';
import StatusCard from '../components/StatusCard';
import CameraFeed from '../components/CameraFeed';
import FleetMap from '../components/FleetMap';
import { mockCameras, getCameraStreams } from '../mock/data';
import robotService from '../services/robotService';
import '../styles/Dashboard.css';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [rosbridgeUrl, setRosbridgeUrl] = useState('wss://monitor.bot-ix.com/rosbridge');
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [isLoadingRobots, setIsLoadingRobots] = useState(false);
  const [cameraStreams, setCameraStreams] = useState(mockCameras);
  const { toast } = useToast();

  // Load robots on mount (check localStorage first)
  useEffect(() => {
    const savedRobots = localStorage.getItem('botix_robots');
    if (savedRobots) {
      const parsedRobots = JSON.parse(savedRobots);
      setRobots(parsedRobots);
      if (parsedRobots.length > 0) {
        setSelectedRobot(parsedRobots[0]);
      }
    } else {
      loadRobots();
    }
  }, []);

  const loadRobots = async () => {
    setIsLoadingRobots(true);
    try {
      const data = await robotService.getRobots();
      if (data.success && data.robots.length > 0) {
        setRobots(data.robots);
        setSelectedRobot(data.robots[0]);
        localStorage.setItem('botix_robots', JSON.stringify(data.robots));
      }
    } catch (error) {
      console.error('Error loading robots:', error);
    } finally {
      setIsLoadingRobots(false);
    }
  };

  const handleAddRobot = (robot) => {
    const updatedRobots = [...robots, robot];
    setRobots(updatedRobots);
    setSelectedRobot(robot);
    localStorage.setItem('botix_robots', JSON.stringify(updatedRobots));
    
    // Update camera streams for the new robot
    if (robot.manual) {
      const streams = getCameraStreams(robot.tailscale_ip, robot.video_port);
      setCameraStreams(streams);
    }
    
    toast({
      title: 'Robot Added',
      description: `${robot.name} has been added successfully`,
    });
  };

  // Update camera streams when selected robot changes
  useEffect(() => {
    if (selectedRobot && selectedRobot.manual) {
      const streams = getCameraStreams(selectedRobot.tailscale_ip, selectedRobot.video_port);
      setCameraStreams(streams);
    } else {
      setCameraStreams(mockCameras);
    }
  }, [selectedRobot]);

  const handleConnect = () => {
    if (!selectedRobot) {
      toast({
        title: 'No robot selected',
        description: 'Please select a robot first',
        variant: 'destructive'
      });
      return;
    }
    
    // Build WebSocket URL from robot config
    const wsUrl = selectedRobot.manual 
      ? `ws://${selectedRobot.tailscale_ip}:${selectedRobot.rosbridge_port}`
      : rosbridgeUrl;
    
    setRosbridgeUrl(wsUrl);
    
    // Mock connection (in real implementation, connect to actual WebSocket)
    setConnectionStatus('Connecting...');
    setTimeout(() => {
      setConnectionStatus('Connected');
      toast({
        title: 'Connected',
        description: `Connected to robot: ${selectedRobot.name || selectedRobot.id}`,
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnectionStatus('Disconnected');
    toast({
      title: 'Disconnected',
      description: 'Robot connection closed',
    });
  };

  const handleJoystickMove = async (x, y) => {
    setJoystickPosition({ x, y });
    
    // Send velocity command to robot if connected
    if (connectionStatus === 'Connected' && selectedRobot) {
      try {
        await robotService.sendVelocityCommand(
          selectedRobot.id,
          y * 0.6,  // linear velocity
          -x * 0.8  // angular velocity
        );
      } catch (error) {
        console.error('Error sending velocity command:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <Header />
      
      <main className="dashboard-main">
        {/* Robot Selector */}
        <RobotSelector 
          robots={robots}
          selectedRobot={selectedRobot}
          onSelectRobot={setSelectedRobot}
          onRefresh={loadRobots}
          isLoading={isLoadingRobots}
          onAddRobot={handleAddRobot}
        />

        {/* Connection Settings */}
        <ConnectionCard 
          rosbridgeUrl={rosbridgeUrl}
          setRosbridgeUrl={setRosbridgeUrl}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={connectionStatus === 'Connected'}
          selectedRobot={selectedRobot}
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
            selectedRobot={selectedRobot}
          />
        </div>

        {/* Camera Grid */}
        <div className="camera-grid">
          <div className="camera-row">
            <CameraFeed 
              title="Front Camera"
              stream={cameraStreams.front}
              topic="/usb_front/usb_cam/image_raw"
              device="/dev/video0"
            />
            <CameraFeed 
              title="Rear Camera"
              stream={cameraStreams.back}
              topic="/usb_back/usb_cam/image_raw"
              device="/dev/video1"
            />
          </div>
          
          <div className="camera-row">
            <CameraFeed 
              title="Left Camera"
              stream={cameraStreams.left}
              topic="/usb_left/usb_cam/image_raw"
              device="/dev/video2"
            />
            <CameraFeed 
              title="Right Camera"
              stream={cameraStreams.right}
              topic="/usb_right/usb_cam/image_raw"
              device="/dev/video3"
            />
          </div>

          <div className="camera-full">
            <CameraFeed 
              title="Internal Camera"
              stream={cameraStreams.internal}
              topic="/usb_internal/usb_cam/image_raw"
              device="/dev/video8"
            />
          </div>
          
          <div className="camera-full">
            <CameraFeed 
              title="RealSense Depth Camera"
              stream={cameraStreams.depth}
              topic="/camera/color/image_raw"
              device="/dev/video10"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;