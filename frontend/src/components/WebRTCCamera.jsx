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
          jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFsZXhibGFuY284MiIsImRldmljZSI6ImRfZTIyOGUxM2I5MiIsImNhcGFiaWxpdHkiOiJAdHJhbnNpdGl2ZS1yb2JvdGljcy93ZWJydGMtdmlkZW8iLCJ2YWxpZGl0eSI6ODY0MDAsImlhdCI6MTc1OTkxNDU2Nn0.xrN3CSFV9gTq00LimJFcE9ts4JZcrFQKvKoEPPkN-s4"
          stream={cameraIndex}
          autoplay="true"
        />
      </div>
    </div>
  );
};

export default WebRTCCamera;
