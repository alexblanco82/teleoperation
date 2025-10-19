import React, { useRef, useEffect, useState } from 'react';
import '../styles/JoystickControl.css';

const JoystickControl = ({ onMove, isConnected }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [joyPos, setJoyPos] = useState({ x: 110, y: 110 });
  const CENTER = { x: 110, y: 110 };
  const RADIUS = 90;
  const STICK_RADIUS = 16;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawJoystick(ctx);
  }, [joyPos]);

  const drawJoystick = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#203044';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw center crosshair
    ctx.strokeStyle = '#2a3c51';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CENTER.x - 10, CENTER.y);
    ctx.lineTo(CENTER.x + 10, CENTER.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CENTER.x, CENTER.y - 10);
    ctx.lineTo(CENTER.x, CENTER.y + 10);
    ctx.stroke();
    
    // Draw stick
    ctx.beginPath();
    ctx.arc(joyPos.x, joyPos.y, STICK_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = isConnected ? '#2f80ed' : '#4a5568';
    ctx.fill();
    
    // Draw stick border
    ctx.strokeStyle = isConnected ? '#1e5fb8' : '#2a3c51';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handlePointerDown = (e) => {
    if (!isConnected) return;
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging && e.type === 'mousemove') return;
    if (!isConnected) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - CENTER.x;
    const dy = y - CENTER.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let newX, newY;
    if (distance > RADIUS) {
      const angle = Math.atan2(dy, dx);
      newX = CENTER.x + Math.cos(angle) * RADIUS;
      newY = CENTER.y + Math.sin(angle) * RADIUS;
    } else {
      newX = x;
      newY = y;
    }
    
    setJoyPos({ x: newX, y: newY });
    
    // Normalize values (-1 to 1)
    const normalizedX = (newX - CENTER.x) / RADIUS;
    const normalizedY = (CENTER.y - newY) / RADIUS; // Inverted Y
    onMove(normalizedX, normalizedY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setJoyPos(CENTER);
    onMove(0, 0);
  };

  return (
    <div className="joystick-card card">
      <label className="field-label">Joystick Control</label>
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className="joystick-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
      <p className="joystick-info">
        Publishes geometry_msgs/Twist on <code>/cmd_vel</code>
      </p>
    </div>
  );
};

export default JoystickControl;