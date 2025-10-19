import React, { useEffect, useRef } from 'react';
import '../styles/FleetMap.css';

const FleetMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // The web component is loaded via script in index.html
    // We just need to ensure it's properly initialized
    if (mapRef.current && !mapRef.current.hasAttribute('initialized')) {
      mapRef.current.setAttribute('initialized', 'true');
    }
  }, []);

  return (
    <div className="fleet-map-container card">
      <div className="fleet-map-header">
        <label className="field-label">Fleet Map</label>
        <span className="map-info">Real-time robot positions via Transitive Robotics</span>
      </div>
      
      <div className="fleet-map-wrapper">
        <maps-fleet
          ref={mapRef}
          id="alexblanco82"
          host="transitiverobotics.com"
          ssl="true"
          jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFsZXhibGFuY284MiIsImRldmljZSI6Il9mbGVldCIsImNhcGFiaWxpdHkiOiJAdHJhbnNpdGl2ZS1yb2JvdGljcy9tYXBzIiwidmFsaWRpdHkiOjg2NDAwLCJpYXQiOjE3NjA5MDI3ODd9.dJKa5sOP5Xfvackddi-HYo23a4k4WJCAHv9LWxuWfcw"
          posesource="default"
        />
      </div>
    </div>
  );
};

export default FleetMap;
