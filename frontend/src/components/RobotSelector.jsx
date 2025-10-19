import React from 'react';
import { Button } from './ui/button';
import { RefreshCw, Bot } from 'lucide-react';
import ManualRobotAdd from './ManualRobotAdd';
import '../styles/RobotSelector.css';

const RobotSelector = ({ robots, selectedRobot, onSelectRobot, onRefresh, isLoading, onAddRobot }) => {
  return (
    <div className="robot-selector card">
      <div className="robot-selector-header">
        <div className="robot-selector-title">
          <Bot size={16} />
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
          <p>No robots found</p>
          <p className="robot-selector-tip">
            Add your robot manually using Tailscale IP
          </p>
          <ManualRobotAdd onAddRobot={onAddRobot} />
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
                <Bot size={20} />
                <span className="robot-name">{robot.name || robot.id}</span>
              </div>
              <div className="robot-card-info">
                <span className="robot-status">
                  {robot.online ? 'Online' : 'Offline'}
                </span>
                {robot.manual && <span className="robot-badge">Manual</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {robots.length > 0 && (
        <ManualRobotAdd onAddRobot={onAddRobot} />
      )}
    </div>
  );
};

export default RobotSelector;