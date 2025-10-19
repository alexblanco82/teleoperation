# Transitive Robotics WebRTC Video Integration Guide

## ✅ What I've Integrated

Your dashboard now uses **Transitive Robotics WebRTC Video** for real-time camera streaming with:

- ✅ 6 camera streams configured
- ✅ Low-latency WebRTC peer-to-peer connection
- ✅ Direct device access (no ROS required for cameras!)
- ✅ JWT authentication

## Camera Configuration

Your robot has 6 cameras configured in the WebRTC component:

| Stream | Device | Resolution | Framerate | Title |
|--------|--------|------------|-----------|-------|
| 0 | /dev/video0 | 1280x720 | 30 fps | Front Camera |
| 1 | /dev/video1 | 1280x720 | 30 fps | Rear Camera |
| 2 | /dev/video2 | 1280x720 | 30 fps | Left Camera |
| 3 | /dev/video3 | 1280x720 | 30 fps | Right Camera |
| 4 | /dev/video8 | 800x600 | 20 fps | Internal Camera |
| 5 | /dev/video10 | 1280x720 | 30 fps | RealSense Depth |

## How It Works

### Traditional ROS Approach (What We Replaced):
```
Camera → ROS usb_cam → web_video_server → Dashboard
         (High latency, requires ROS, CORS issues)
```

### New WebRTC Approach:
```
Camera → Transitive Agent → WebRTC P2P → Dashboard
         (Low latency, direct, no ROS needed!)
```

## Setup on Robot

### 1. Transitive Agent Must Be Running

The cameras work through the Transitive Robotics agent that's already on your robot. From your logs, I can see it's running:

```bash
# Check if agent is running:
ps aux | grep transitive

# Should show:
# node --preserve-symlinks main.js
```

### 2. Verify Camera Devices

```bash
# On robot (100.64.252.45):
ls -l /dev/video*

# Your devices:
# /dev/video0  - Front
# /dev/video1  - Rear
# /dev/video2  - Left
# /dev/video3  - Right
# /dev/video8  - Internal
# /dev/video10 - RealSense
```

### 3. Camera Permissions

Make sure the Transitive agent has access:

```bash
# Add user to video group:
sudo usermod -aG video $USER

# Or give direct access:
sudo chmod 666 /dev/video*
```

## Using the Dashboard

### 1. Open Dashboard
```
http://localhost:3000
```

### 2. Add Your Robot
- Click "Add Robot Manually"
- Enter:
  - **Name**: BOT-IX Jetson Xavier
  - **Tailscale IP**: 100.64.252.45
  - **ROSBridge Port**: 9090
  - **Video Port**: 8080

### 3. View Cameras
The cameras will automatically connect via WebRTC when:
- ✅ Transitive agent is running on robot
- ✅ Robot is reachable at 100.64.252.45
- ✅ Camera devices are accessible

## Advantages Over ROS web_video_server

| Feature | WebRTC (New) | web_video_server (Old) |
|---------|--------------|------------------------|
| Latency | 100-300ms | 500-2000ms |
| CPU Usage | Low | High (encoding) |
| Setup | Automatic | Manual ROS nodes |
| CORS Issues | None | Requires proxy |
| Bandwidth | Adaptive | Fixed |
| Connection | P2P | Client-Server |

## Troubleshooting

### Cameras Not Showing

**1. Check Transitive Agent**
```bash
# On robot:
ps aux | grep transitive

# If not running, your logs show it starts automatically
# But you can restart with:
pkill -f transitive
# It will auto-restart via systemd/supervisor
```

**2. Check Device Access**
```bash
# Test camera directly:
v4l2-ctl --device=/dev/video0 --list-formats-ext

# Should show supported formats
```

**3. Check Network**
```bash
# From dashboard server:
ping 100.64.252.45
telnet 100.64.252.45 9090  # Should connect
```

**4. Browser Console**
Open browser DevTools (F12) and check for WebRTC errors:
```
Failed to access camera
WebRTC connection failed
ICE connection failed
```

### "Waiting for connection..." Message

This means the WebRTC component is trying to establish P2P connection:

1. **Check firewall**: Ensure UDP ports are open for WebRTC
2. **Check Tailscale**: Both machines should be on same Tailscale network
3. **Check JWT**: Token expires in 24 hours (validity: 86400 seconds)

### JWT Token Expired

Your current JWT:
- **Issued**: 1759914566 (Check if expired)
- **Validity**: 86400 seconds (24 hours)
- **Device**: d_e228e13b92

To get new token:
1. Go to Transitive Robotics portal
2. Navigate to your device
3. Generate new WebRTC token
4. Update in `/app/frontend/src/components/WebRTCCamera.jsx`

## Comparison with Your Previous Setup

### What You Had:
```bash
# Requires multiple ROS nodes:
roscore
rosrun usb_cam usb_cam_node _video_device:=/dev/video8
rosrun web_video_server web_video_server
```

### What You Have Now:
```bash
# Just Transitive agent (already running):
# Cameras work automatically via WebRTC!
```

## Camera Quality Settings

To adjust camera settings, modify in Transitive portal or the webrtc-video-device attributes:

- **quantizer**: "30" (lower = better quality, more bandwidth)
- **framerate**: "30/1" (fps)
- **width/height**: Resolution

## Advanced Configuration

If you want to customize individual cameras:

```jsx
<webrtc-video-device
  stream="0"
  quantizer="25"  // Better quality
  framerate="60/1"  // Higher FPS
  width="1920"
  height="1080"
/>
```

## Status Check

Run this to verify everything:

```bash
# On robot:
echo "=== Transitive Agent ==="
ps aux | grep transitive | grep -v grep

echo "=== Camera Devices ==="
ls -l /dev/video* 2>/dev/null

echo "=== Network ==="
ip addr show tailscale0

echo "=== Permissions ==="
groups | grep video
```

## Next Steps

1. ✅ **Dashboard is ready** - Just refresh http://localhost:3000
2. ✅ **Cameras will auto-connect** - No manual ROS setup needed
3. 🎯 **Test joystick** - Send commands to robot
4. 🎯 **View fleet map** - See robot position
5. 🎯 **Add more robots** - Scale your fleet!
