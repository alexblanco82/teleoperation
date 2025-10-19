from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import logging
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from transitive_client import TransitiveRoboticsClient

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/robots", tags=["robots"])

# Initialize Transitive client
transitive_client = TransitiveRoboticsClient()

class VelocityCommand(BaseModel):
    linear_x: float
    linear_y: float = 0.0
    linear_z: float = 0.0
    angular_x: float = 0.0
    angular_y: float = 0.0
    angular_z: float

class RobotCommand(BaseModel):
    robot_id: str
    command_type: str
    velocity: Optional[VelocityCommand] = None

@router.get("/list")
async def list_robots():
    """Get list of all robots from Transitive Robotics"""
    try:
        robots = await transitive_client.get_robots()
        return {"success": True, "robots": robots}
    except Exception as e:
        logger.error(f"Error listing robots: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch robots")

@router.get("/status/{robot_id}")
async def get_robot_status(robot_id: str):
    """Get status of a specific robot"""
    try:
        status = await transitive_client.get_robot_status(robot_id)
        if status:
            return {"success": True, "status": status}
        else:
            raise HTTPException(status_code=404, detail="Robot not found")
    except Exception as e:
        logger.error(f"Error getting robot status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch robot status")

@router.post("/command")
async def send_robot_command(command: RobotCommand):
    """Send command to robot"""
    try:
        if command.command_type == "velocity" and command.velocity:
            cmd_data = {
                "type": "cmd_vel",
                "data": {
                    "linear": {
                        "x": command.velocity.linear_x,
                        "y": command.velocity.linear_y,
                        "z": command.velocity.linear_z
                    },
                    "angular": {
                        "x": command.velocity.angular_x,
                        "y": command.velocity.angular_y,
                        "z": command.velocity.angular_z
                    }
                }
            }
            success = await transitive_client.send_command(command.robot_id, cmd_data)
            if success:
                return {"success": True, "message": "Command sent successfully"}
            else:
                raise HTTPException(status_code=500, detail="Failed to send command")
        else:
            raise HTTPException(status_code=400, detail="Invalid command type")
    except Exception as e:
        logger.error(f"Error sending command: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send command")