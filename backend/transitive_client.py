import os
import aiohttp
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class TransitiveRoboticsClient:
    """Client for interacting with Transitive Robotics API"""
    
    def __init__(self):
        self.jwt_token = os.environ.get('TRANSITIVE_JWT_TOKEN')
        self.user_id = os.environ.get('TRANSITIVE_USER_ID')
        self.api_base = os.environ.get('TRANSITIVE_API_BASE')
        
        if not all([self.jwt_token, self.user_id, self.api_base]):
            logger.warning("Transitive Robotics credentials not fully configured")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get authentication headers for API requests"""
        return {
            'Authorization': f'Bearer {self.jwt_token}',
            'Content-Type': 'application/json'
        }
    
    async def get_robots(self) -> List[Dict]:
        """Fetch list of robots from Transitive Robotics"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.api_base}/devices"
                async with session.get(url, headers=self._get_headers()) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Successfully fetched {len(data)} robots")
                        return data
                    else:
                        logger.error(f"Failed to fetch robots: {response.status}")
                        return []
        except Exception as e:
            logger.error(f"Error fetching robots: {str(e)}")
            return []
    
    async def get_robot_status(self, robot_id: str) -> Optional[Dict]:
        """Get status of a specific robot"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.api_base}/devices/{robot_id}"
                async with session.get(url, headers=self._get_headers()) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Successfully fetched status for robot {robot_id}")
                        return data
                    else:
                        logger.error(f"Failed to fetch robot status: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error fetching robot status: {str(e)}")
            return None
    
    async def send_command(self, robot_id: str, command: Dict) -> bool:
        """Send command to robot via Transitive Robotics"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.api_base}/devices/{robot_id}/command"
                async with session.post(url, headers=self._get_headers(), json=command) as response:
                    if response.status in [200, 201]:
                        logger.info(f"Successfully sent command to robot {robot_id}")
                        return True
                    else:
                        logger.error(f"Failed to send command: {response.status}")
                        return False
        except Exception as e:
            logger.error(f"Error sending command: {str(e)}")
            return False