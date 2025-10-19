import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';
import '../styles/ManualRobotAdd.css';

const ManualRobotAdd = ({ onAddRobot }) => {
  const [showForm, setShowForm] = useState(false);
  const [robotData, setRobotData] = useState({
    name: '',
    tailscaleIp: '100.64.252.45',
    rosbridgePort: '9090',
    videoPort: '8080'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRobot({
      id: `robot_${Date.now()}`,
      name: robotData.name || `Robot ${robotData.tailscaleIp}`,
      tailscale_ip: robotData.tailscaleIp,
      rosbridge_port: robotData.rosbridgePort,
      video_port: robotData.videoPort,
      online: true,
      manual: true
    });
    setShowForm(false);
    setRobotData({
      name: '',
      tailscaleIp: '100.64.252.45',
      rosbridgePort: '9090',
      videoPort: '8080'
    });
  };

  return (
    <div className="manual-robot-add">
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)}
          className="add-robot-button"
        >
          <Plus size={16} />
          Add Robot Manually
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="robot-form">
          <div className="form-field">
            <label>Robot Name</label>
            <Input 
              value={robotData.name}
              onChange={(e) => setRobotData({...robotData, name: e.target.value})}
              placeholder="My Robot"
            />
          </div>
          <div className="form-field">
            <label>Tailscale IP</label>
            <Input 
              value={robotData.tailscaleIp}
              onChange={(e) => setRobotData({...robotData, tailscaleIp: e.target.value})}
              placeholder="100.64.252.45"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>ROSBridge Port</label>
              <Input 
                value={robotData.rosbridgePort}
                onChange={(e) => setRobotData({...robotData, rosbridgePort: e.target.value})}
                placeholder="9090"
              />
            </div>
            <div className="form-field">
              <label>Video Port</label>
              <Input 
                value={robotData.videoPort}
                onChange={(e) => setRobotData({...robotData, videoPort: e.target.value})}
                placeholder="8080"
              />
            </div>
          </div>
          <div className="form-actions">
            <Button type="submit" className="submit-button">Add Robot</Button>
            <Button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="cancel-button"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManualRobotAdd;
