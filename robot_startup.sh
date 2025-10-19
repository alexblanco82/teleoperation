#!/bin/bash
# BOT-IX Robot Startup Script
# Run this on your Jetson at 100.64.252.45

set -e

echo "🤖 Starting BOT-IX Robot Services..."

# Source ROS
source /opt/ros/melodic/setup.bash

# Start roscore in background
echo "Starting ROS Master..."
roscore &
sleep 3

# Start USB camera node (video8)
echo "Starting USB Camera (/dev/video8)..."
rosrun usb_cam usb_cam_node \
  _video_device:=/dev/video8 \
  _pixel_format:=yuyv \
  _image_width:=1280 \
  _image_height:=720 \
  _framerate:=30 \
  _camera_name:=usb_cam \
  _camera_frame_id:=usb_cam \
  &

# Start RealSense camera
echo "Starting RealSense Camera..."
roslaunch realsense2_camera rs_camera.launch \
  enable_depth:=true \
  enable_color:=true \
  enable_infra:=false \
  &

sleep 3

# Start ROSBridge WebSocket server
echo "Starting ROSBridge (port 9090)..."
roslaunch rosbridge_server rosbridge_websocket.launch \
  port:=9090 \
  address:=0.0.0.0 \
  &

# Start web_video_server
echo "Starting Web Video Server (port 8080)..."
rosrun web_video_server web_video_server \
  _port:=8080 \
  _address:=0.0.0.0 \
  &

echo "✅ All services started!"
echo ""
echo "📡 Services running:"
echo "  - ROS Master: http://100.64.252.45:11311"
echo "  - ROSBridge: ws://100.64.252.45:9090"
echo "  - Video Server: http://100.64.252.45:8080"
echo ""
echo "📹 Camera topics:"
echo "  - /usb_cam/image_raw"
echo "  - /camera/color/image_raw"
echo "  - /camera/depth/image_rect_raw"
echo ""
echo "🌐 Dashboard: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait
