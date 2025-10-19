// Real camera stream URLs for robot at 100.64.252.45
export const getCameraStreams = (robotIp, videoPort = '8080') => ({
  // USB camera at port 0:3.4.4
  usb_main: `http://${robotIp}:${videoPort}/stream?topic=/usb_cam/image_raw`,
  
  // RealSense camera streams (2 streams on video9/video10)
  realsense_color: `http://${robotIp}:${videoPort}/stream?topic=/camera/color/image_raw`,
  realsense_depth: `http://${robotIp}:${videoPort}/stream?topic=/camera/depth/image_rect_raw`,
  
  // If you add more USB cameras later, they'll appear here
  front: `http://${robotIp}:${videoPort}/stream?topic=/usb_front/image_raw`,
  back: `http://${robotIp}:${videoPort}/stream?topic=/usb_back/image_raw`,
  left: `http://${robotIp}:${videoPort}/stream?topic=/usb_left/image_raw`,
  right: `http://${robotIp}:${videoPort}/stream?topic=/usb_right/image_raw`
});

// Mock camera streams - fallback placeholder
export const mockCameras = {
  usb_main: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1280&h=720&fit=crop',
  realsense_color: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1280&h=720&fit=crop',
  realsense_depth: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=1280&h=720&fit=crop',
  front: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=1280&h=720&fit=crop',
  back: 'https://images.unsplash.com/photo-1581092160607-ee67e4ae3a87?w=1280&h=720&fit=crop',
  left: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1280&h=720&fit=crop',
  right: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1280&h=720&fit=crop'
};

// Camera device mappings (ACTUAL devices on your Jetson)
export const cameraDevices = {
  usb_main: '/dev/video8',        // USB camera at port 0:3.4.4
  realsense_color: '/dev/video9',  // RealSense color stream
  realsense_depth: '/dev/video10', // RealSense depth stream
  // Add more as you connect additional cameras
  front: 'Not connected',
  back: 'Not connected',
  left: 'Not connected',
  right: 'Not connected'
};

// Mock robot status data
export const mockRobotStatus = {
  battery: 85,
  temperature: 42,
  uptime: '12h 34m',
  location: { x: 12.5, y: 8.3, theta: 1.57 },
  speed: { linear: 0, angular: 0 }
};

// Mock WebSocket connection
export class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0; // CONNECTING
    
    setTimeout(() => {
      this.readyState = 1; // OPEN
      if (this.onopen) this.onopen();
    }, 1000);
  }
  
  send(data) {
    console.log('Sending to robot:', data);
  }
  
  close() {
    this.readyState = 3; // CLOSED
    if (this.onclose) this.onclose();
  }
}