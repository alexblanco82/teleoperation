import React, { useEffect, useRef } from 'react';
import '../styles/WebRTCCamera.css';

const WebRTCCamera = ({ cameraIndex = 0, title, device }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // The web component is loaded via script in index.html
    if (videoRef.current && !videoRef.current.hasAttribute('initialized')) {
      videoRef.current.setAttribute('initialized', 'true');
    }
  }, []);

  return (
    <div className="webrtc-camera card">
      <div className="webrtc-header">
        <label className="field-label">{title}</label>
        <span className="camera-device">{device}</span>
      </div>
      
      <div className="webrtc-container">
        <webrtc-video-device
          ref={videoRef}
          id="alexblanco82"
          host="transitiverobotics.com"
          ssl="true"
          jwt="LGfIYiaxtY5RxSc5NFsgSELRrXNlcYLi+nRmT93+hkczXQQ0mzhJdjPH8J1uR0W7"
          stream={cameraIndex}
          autoplay="true"
        />
      </div>
    </div>
  );
};

export default WebRTCCamera;
