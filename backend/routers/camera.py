from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
import aiohttp
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/camera", tags=["camera"])

@router.get("/stream/{robot_ip}/{topic:path}")
async def stream_camera(robot_ip: str, topic: str, port: int = 8080):
    """
    Proxy camera streams from robot to avoid CORS issues
    Example: /api/camera/stream/100.64.252.45/usb_cam/image_raw?port=8080
    """
    try:
        # Build the robot's video server URL
        robot_url = f"http://{robot_ip}:{port}/stream?topic=/{topic}"
        
        logger.info(f"Proxying camera stream from {robot_url}")
        
        async def stream_generator():
            timeout = aiohttp.ClientTimeout(total=None, connect=10, sock_read=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                try:
                    async with session.get(robot_url) as response:
                        if response.status != 200:
                            logger.error(f"Robot returned status {response.status}")
                            yield b''
                            return
                        
                        # Stream the video chunks
                        async for chunk in response.content.iter_chunked(8192):
                            yield chunk
                            
                except aiohttp.ClientError as e:
                    logger.error(f"Error streaming from robot: {str(e)}")
                    yield b''
        
        return StreamingResponse(
            stream_generator(),
            media_type="multipart/x-mixed-replace; boundary=frame",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
        
    except Exception as e:
        logger.error(f"Camera stream error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to stream camera: {str(e)}")

@router.get("/check/{robot_ip}")
async def check_video_server(robot_ip: str, port: int = 8080):
    """
    Check if robot's video server is accessible
    """
    try:
        robot_url = f"http://{robot_ip}:{port}/"
        
        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(robot_url) as response:
                return {
                    "accessible": response.status == 200,
                    "status": response.status,
                    "robot_url": robot_url
                }
    except Exception as e:
        return {
            "accessible": False,
            "error": str(e),
            "robot_url": f"http://{robot_ip}:{port}/"
        }
