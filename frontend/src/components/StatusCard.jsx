import React from 'react';
import '../styles/StatusCard.css';

const StatusCard = ({ status, joystickPosition }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Connected':
        return '#10b981';
      case 'Connecting...':
        return '#f59e0b';
      case 'Disconnected':
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="status-card card">
      <label className="field-label">Status</label>
      <div className="status-content">
        <div className="status-indicator" style={{ background: getStatusColor() }}>
          <div className="status-pulse" style={{ background: getStatusColor() }} />
        </div>
        <div className="status-text">{status}</div>
      </div>
      
      {status === 'Connected' && (
        <div className="velocity-info">
          <div className="velocity-row">
            <span className="velocity-label">Linear X:</span>
            <span className="velocity-value">{joystickPosition.y.toFixed(2)} m/s</span>
          </div>
          <div className="velocity-row">
            <span className="velocity-label">Angular Z:</span>
            <span className="velocity-value">{(-joystickPosition.x).toFixed(2)} rad/s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCard;