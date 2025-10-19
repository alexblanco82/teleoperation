import React, { useState } from 'react';
import '../styles/CameraFeed.css';

const CameraFeed = ({ title, stream, topic, device }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="camera-feed card">
      <div className="camera-header">
        <label className="field-label">{title}</label>
        <div className="camera-info">
          <span className="camera-topic">{topic}</span>
          {device && <span className="camera-device">{device}</span>}
        </div>
      </div>
      
      <div className="camera-container">
        {isLoading && (
          <div className="camera-placeholder">
            <div className="camera-spinner" />
            <span>Loading stream...</span>
          </div>
        )}
        
        {hasError && (
          <div className="camera-placeholder">
            <span>No signal</span>
            <span className="camera-error-hint">Check if camera is connected and ROS is running</span>
          </div>
        )}
        
        <img
          src={stream}
          alt={title}
          className="camera-image"
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoading || hasError ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default CameraFeed;