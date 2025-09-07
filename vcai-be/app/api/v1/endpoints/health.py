"""
Health check endpoints
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy", "service": "vcai-backend-api"}


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with system information"""
    import psutil
    import time
    
    return {
        "status": "healthy",
        "service": "vcai-backend-api",
        "timestamp": time.time(),
        "system": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent
        }
    }
