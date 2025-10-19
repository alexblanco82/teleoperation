# BOT-IX Robot Monitor & Teleop - Implementation Contracts

## Current Status
✅ **Frontend with Mock Data** - Fully functional UI with simulated robot control and camera feeds

## Mock Data Locations
- `/app/frontend/src/mock/data.js` - Contains mock camera streams and WebSocket implementation

## Future Backend Implementation (When Requested)

### API Contracts

#### 1. WebSocket Endpoint: ROSBridge Connection
**Endpoint:** `ws://localhost:8001/api/rosbridge`
- **Purpose:** Real-time bidirectional communication with robot via ROSBridge protocol
- **Messages:**
  - **Publish cmd_vel:** `{ op: "publish", topic: "/cmd_vel", msg: { linear: {x, y, z}, angular: {x, y, z} } }`
  - **Subscribe topics:** `{ op: "subscribe", topic: "/camera/image_raw" }`
  - **Robot status updates:** Battery, temperature, location telemetry

#### 2. Camera Stream Endpoints
**Endpoints:** 
- `GET /api/stream/front`
- `GET /api/stream/back`
- `GET /api/stream/left`
- `GET /api/stream/right`
- `GET /api/stream/internal`

**Response:** MJPEG stream or WebRTC connection to robot cameras

#### 3. Robot Configuration
**Endpoint:** `GET/POST /api/robot/config`
- Get/update robot connection settings (IP, ports, credentials)
- Store Tailscale IP configurations

#### 4. Robot Status
**Endpoint:** `GET /api/robot/status`
- Real-time robot telemetry (battery, temperature, uptime, location)

### Database Schema (MongoDB)

#### RobotConfig Collection
```javascript
{
  _id: ObjectId,
  name: String,
  tailscale_ip: String,
  rosbridge_port: Number,
  video_server_port: Number,
  created_at: DateTime,
  last_connected: DateTime,
  status: String // 'connected', 'disconnected', 'error'
}
```

#### TelemetryLog Collection
```javascript
{
  _id: ObjectId,
  robot_id: ObjectId,
  timestamp: DateTime,
  battery: Number,
  temperature: Number,
  location: { x: Number, y: Number, theta: Number },
  speed: { linear: Number, angular: Number }
}
```

### Frontend-Backend Integration Plan

#### Phase 1: Replace Mock WebSocket
1. Update `ConnectionCard.jsx` to use real WebSocket connection
2. Replace `MockWebSocket` in `/mock/data.js` with actual `rosbridge` library
3. Handle connection states (connecting, connected, error, disconnected)

#### Phase 2: Real Camera Streams
1. Update `CameraFeed.jsx` to fetch from backend API endpoints
2. Implement MJPEG streaming or WebRTC for low latency
3. Add stream quality controls

#### Phase 3: Telemetry & Logging
1. Add robot status monitoring dashboard
2. Implement telemetry logging to MongoDB
3. Create historical data visualization

#### Phase 4: Multi-Robot Support
1. Add robot selection dropdown
2. Support multiple simultaneous robot connections
3. Robot fleet management interface

### Technology Stack for Backend

**Core:**
- FastAPI (already in place)
- Motor (MongoDB async driver)
- python-socketio or websockets for ROSBridge proxy

**ROS Integration:**
- roslibpy (Python ROSBridge client)
- OpenCV for camera stream processing
- ffmpeg for video encoding

**Authentication:**
- JWT tokens for web interface
- Robot authentication via API keys

### Environment Variables (.env)
```bash
# Robot Connection
ROBOT_TAILSCALE_IP=100.64.252.45
ROSBRIDGE_PORT=9090
WEB_VIDEO_SERVER_PORT=8080
FOXGLOVE_PORT=8765

# Security
JWT_SECRET=<generate-secret>
ROBOT_API_KEY=<generate-key>
```

### Notes
- Current mock implementation uses Unsplash images for camera placeholders
- Joystick control logic is fully implemented on frontend
- All color schemes and UI design match original BOT-IX specification
- WebSocket connection is simulated with 1.5s delay for realistic UX
