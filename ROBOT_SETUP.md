# BOT-IX Robot Setup Guide

## Current Status
Your robot at **100.64.252.45** has:
- ✅ 1x USB Camera: `/dev/video8` (port 0:3.4.4)
- ✅ 1x RealSense Camera: `/dev/video9` (color), `/dev/video10` (depth)
- ⚠️  ROS not sourced in current shell

## Quick Start on Robot (Jetson Xavier)

### 1. Source ROS Environment
```bash
# Add to ~/.bashrc for automatic sourcing:
echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Verify ROS is working:
rosversion -d  # Should output: melodic
```

### 2. Install Required ROS Packages
```bash
sudo apt-get update
sudo apt-get install -y \
  ros-melodic-usb-cam \
  ros-melodic-web-video-server \
  ros-melodic-rosbridge-server \
  ros-melodic-realsense2-camera
```

### 3. Start All Robot Services
Copy the startup script to your robot and run:
```bash
# On robot (100.64.252.45):
chmod +x robot_startup.sh
./robot_startup.sh
```

This starts:
- ROS Master (port 11311)
- USB Camera node → `/usb_cam/image_raw`
- RealSense Camera → `/camera/color/image_raw`, `/camera/depth/image_rect_raw`
- ROSBridge WebSocket (port 9090)
- Web Video Server (port 8080)

### 4. Verify Services
```bash
# Check topics:
rostopic list

# Should see:
# /usb_cam/image_raw
# /camera/color/image_raw
# /camera/depth/image_rect_raw
# /cmd_vel

# Test camera streams:
curl http://100.64.252.45:8080/stream?topic=/usb_cam/image_raw
```

## Dashboard Setup (Already Done!)

### 1. Add Your Robot
- Open: http://localhost:3000
- Click "Add Robot Manually"
- Enter:
  - **Name**: BOT-IX Jetson Xavier
  - **Tailscale IP**: 100.64.252.45
  - **ROSBridge Port**: 9090
  - **Video Port**: 8080
- Click "Add Robot"

### 2. Connect & Control
- Click "Connect" button
- Use joystick to publish velocity commands to `/cmd_vel`
- View camera streams (once robot services are running)
- See robot position on fleet map (once SLAM data published)

## Camera Topics Reference

| Camera | Device | ROS Topic | Stream URL |
|--------|--------|-----------|------------|
| USB Main | /dev/video8 | /usb_cam/image_raw | http://100.64.252.45:8080/stream?topic=/usb_cam/image_raw |
| RealSense Color | /dev/video9 | /camera/color/image_raw | http://100.64.252.45:8080/stream?topic=/camera/color/image_raw |
| RealSense Depth | /dev/video10 | /camera/depth/image_rect_raw | http://100.64.252.45:8080/stream?topic=/camera/depth/image_rect_raw |

## Adding More Cameras

When you connect additional USB cameras:
1. Check device: `ls -l /dev/v4l/by-path/`
2. Add camera node in startup script
3. Dashboard will automatically pick up new topics

## Troubleshooting

### "ros: command not found"
```bash
source /opt/ros/melodic/setup.bash
```

### Camera not streaming
```bash
# Check if device exists:
ls -l /dev/video8

# Check camera info:
v4l2-ctl --device=/dev/video8 --list-formats-ext

# Test with ROS:
rosrun usb_cam usb_cam_node _video_device:=/dev/video8
rostopic echo /usb_cam/image_raw
```

### ROSBridge connection failed
```bash
# Check if running:
rostopic list | grep rosbridge

# Test WebSocket:
wscat -c ws://100.64.252.45:9090
```

### No video in dashboard
1. Verify web_video_server is running: `rosnode list`
2. Check topic is publishing: `rostopic hz /usb_cam/image_raw`
3. Test stream directly: Open `http://100.64.252.45:8080/stream?topic=/usb_cam/image_raw` in browser

## Next Steps

1. **Setup Segway Base**: Your original script had `segway_ros_sdk` - integrate that
2. **Add Navigation**: Setup move_base, AMCL for autonomous navigation
3. **Create Maps**: Use SLAM to create maps for Transitive Fleet Map
4. **Add More Cameras**: Connect front/back/left/right cameras as needed

## Support

- Dashboard: http://localhost:3000
- Robot logs: `rostopic echo /rosout`
- Service status: `rosnode list && rostopic list`
