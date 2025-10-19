# Camera Troubleshooting Guide

## Why You Can't See Cameras

The cameras are not showing because the **robot services are not running yet** on your Jetson at 100.64.252.45.

## Quick Fix - Start Robot Services

### On Your Robot (100.64.252.45):

```bash
# 1. Source ROS
source /opt/ros/melodic/setup.bash

# 2. Start ROS Master
roscore &
sleep 3

# 3. Start USB Camera
rosrun usb_cam usb_cam_node \
  _video_device:=/dev/video8 \
  _pixel_format:=yuyv \
  _image_width:=1280 \
  _image_height:=720 \
  _framerate:=30 &

# 4. Start RealSense (if installed)
roslaunch realsense2_camera rs_camera.launch &

# 5. Start Web Video Server (THIS IS REQUIRED FOR CAMERAS!)
rosrun web_video_server web_video_server \
  _port:=8080 \
  _address:=0.0.0.0 &

# 6. Verify it's working
curl http://localhost:8080/
rostopic list
rostopic hz /usb_cam/image_raw
```

## What I Fixed

✅ **Added Camera Proxy** - Backend now proxies camera streams to avoid CORS issues
- Old (blocked): `http://100.64.252.45:8080/stream?topic=/usb_cam/image_raw`
- New (works): `http://localhost:8001/api/camera/stream/100.64.252.45/usb_cam/image_raw`

✅ **Camera Endpoints**:
- `/api/camera/stream/{robot_ip}/{topic}` - Proxy camera stream
- `/api/camera/check/{robot_ip}` - Check if video server is accessible

## Testing Cameras

### 1. Add Your Robot to Dashboard
- Open: http://localhost:3000
- Click "Add Robot Manually"
- Enter IP: `100.64.252.45`
- Ports: ROSBridge `9090`, Video `8080`

### 2. Check Video Server Status
```bash
# From your development machine:
curl http://localhost:8001/api/camera/check/100.64.252.45?port=8080
```

Should return:
```json
{
  "accessible": true,
  "status": 200,
  "robot_url": "http://100.64.252.45:8080/"
}
```

### 3. Test Camera Stream
Open in browser:
```
http://localhost:8001/api/camera/stream/100.64.252.45/usb_cam/image_raw?port=8080
```

You should see the camera stream!

## Common Issues

### "No signal" in dashboard
**Cause**: Robot services not running
**Fix**: Start roscore, usb_cam_node, and web_video_server on robot

### "Loading stream..." forever
**Cause**: 
1. Robot not reachable at 100.64.252.45
2. web_video_server not running
3. Topic name wrong

**Fix**:
```bash
# On robot, check topics:
rostopic list

# Should see:
# /usb_cam/image_raw
# /camera/color/image_raw

# Check if streaming:
rostopic hz /usb_cam/image_raw

# Test web_video_server directly:
curl http://100.64.252.45:8080/
```

### Camera shows but no updates
**Cause**: Camera not publishing
**Fix**:
```bash
# Check camera device
ls -l /dev/video8

# Restart camera node
rosnode kill usb_cam
rosrun usb_cam usb_cam_node _video_device:=/dev/video8 &
```

## Your Camera Setup

| Camera | Device | ROS Topic | Dashboard Shows |
|--------|--------|-----------|----------------|
| USB Main | /dev/video8 | /usb_cam/image_raw | "USB Camera (Main)" |
| RealSense Color | /dev/video9 | /camera/color/image_raw | "RealSense Color" |
| RealSense Depth | /dev/video10 | /camera/depth/image_rect_raw | "RealSense Depth" |

## Next Steps

1. **Start robot services** (see commands above)
2. **Verify topics**: `rostopic list`
3. **Test stream**: Open camera URL in browser
4. **Refresh dashboard** - cameras should appear!

## Still Not Working?

Check backend logs:
```bash
tail -f /var/log/supervisor/backend.out.log
```

Check if robot is reachable:
```bash
ping 100.64.252.45
curl http://100.64.252.45:8080/
```
