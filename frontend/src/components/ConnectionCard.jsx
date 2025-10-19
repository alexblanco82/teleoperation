import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import '../styles/ConnectionCard.css';

const ConnectionCard = ({ rosbridgeUrl, setRosbridgeUrl, onConnect, onDisconnect, isConnected }) => {
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
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>
      <p className="connection-tip">
        Tip: Robot over Tailscale is at ws://100.64.252.45:9090 from the VPS. This page proxies via Nginx.
      </p>
    </div>
  );
};

export default ConnectionCard;