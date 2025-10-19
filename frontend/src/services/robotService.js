import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const robotService = {
  // Fetch list of robots
  async getRobots() {
    try {
      const response = await axios.get(`${API}/robots/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching robots:', error);
      throw error;
    }
  },

  // Get robot status
  async getRobotStatus(robotId) {
    try {
      const response = await axios.get(`${API}/robots/status/${robotId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching robot status:', error);
      throw error;
    }
  },

  // Send velocity command
  async sendVelocityCommand(robotId, linearX, angularZ) {
    try {
      const response = await axios.post(`${API}/robots/command`, {
        robot_id: robotId,
        command_type: 'velocity',
        velocity: {
          linear_x: linearX,
          linear_y: 0.0,
          linear_z: 0.0,
          angular_x: 0.0,
          angular_y: 0.0,
          angular_z: angularZ
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }
};

export default robotService;