import React, { useState } from 'react';
import '../styles/CameraFeed.css';

const CameraFeed = ({ title, stream, topic }) => {
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
        <span className="camera-topic">{topic}</span>
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