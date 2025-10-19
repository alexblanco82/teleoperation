import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import '../styles/ConnectionCard.css';

const ConnectionCard = ({ rosbridgeUrl, setRosbridgeUrl, onConnect, onDisconnect, isConnected, selectedRobot }) => {
  return (
    <div className="connection-card card">
      <div className="connection-row">
        <div className="connection-field">
          <label className="field-label">ROSBridge URL</label>
          <Input 
            value={rosbridgeUrl}
            onChange={(e) => setRosbridgeUrl(e.target.value)}
            className="connection-input"
            disabled={isConnected}
          />
        </div>
        <div className="connection-field">
          <label className="field-label">Connection</label>
          <Button 
            onClick={isConnected ? onDisconnect : onConnect}
            className={`connection-button ${isConnected ? 'connected' : ''}`}
            disabled={!selectedRobot}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>
      <p className="connection-tip">
        {selectedRobot ? (
          <>
            Selected robot: <strong>{selectedRobot.name || selectedRobot.id}</strong> • 
            Robot over Tailscale proxies via Nginx
          </>
        ) : (
          'Please select a robot above to enable connection'
        )}
      </p>
    </div>
  );
};

export default ConnectionCard;