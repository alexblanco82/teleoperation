import React from 'react';
import { Button } from './ui/button';
import { RefreshCw, Robot } from 'lucide-react';
import '../styles/RobotSelector.css';

const RobotSelector = ({ robots, selectedRobot, onSelectRobot, onRefresh, isLoading }) => {
  return (
    <div className="robot-selector card">
      <div className="robot-selector-header">
        <div className="robot-selector-title">
          <Robot size={16} />
          <label className="field-label">Select Robot</label>
        </div>
        <Button 
          onClick={onRefresh}
          disabled={isLoading}
          className="refresh-button"
          size="sm"
        >
          <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
          Refresh
        </Button>
      </div>
      
      {robots.length === 0 ? (
        <div className="robot-selector-empty">
          <p>No robots found in Transitive Robotics</p>
          <p className="robot-selector-tip">
            Make sure your robots are connected and registered
          </p>
        </div>
      ) : (
        <div className="robot-grid">
          {robots.map((robot) => (
            <div
              key={robot.id}
              className={`robot-card ${selectedRobot?.id === robot.id ? 'selected' : ''}`}
              onClick={() => onSelectRobot(robot)}
            >
              <div className="robot-card-header">
                <Robot size={20} />
                <span className="robot-name">{robot.name || robot.id}</span>
              </div>
              <div className="robot-card-info">
                <span className="robot-status">
                  {robot.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RobotSelector;