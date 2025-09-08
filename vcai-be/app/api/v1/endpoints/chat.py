"""
Chat endpoints for specialized AutoGen integration with file upload support
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import json

from app.services.specialized_autogen_service import SpecializedAutoGenService
from app.core.exceptions import AutoGenException

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: Optional[str] = None


class FileInfo(BaseModel):
    name: str
    type: str
    size: int


class StartupAnalysisRequest(BaseModel):
    prompt: str
    conversation_id: Optional[str] = None
    files: Optional[List[FileInfo]] = None


class StartupAnalysisResponse(BaseModel):
    conversation_id: str
    status: str
    message: str
    websocket_url: str


@router.post("/analyze-startup", response_model=StartupAnalysisResponse)
async def analyze_startup_idea(
    prompt: str = Form(...),
    conversation_id: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None)
):
    """Start the specialized startup analysis workflow with file uploads"""
    try:
        autogen_service = SpecializedAutoGenService()
        
        # Process uploaded files
        file_info = []
        if files:
            for file in files:
                # In a real implementation, you'd save files and process them
                file_info.append({
                    "name": file.filename,
                    "type": file.content_type,
                    "size": file.size if hasattr(file, 'size') else 0
                })
        
        # Start the analysis workflow (runs in background)
        import asyncio
        asyncio.create_task(autogen_service.process_startup_analysis(
            prompt=prompt,
            files=file_info,
            conversation_id=conversation_id
        ))
        
        # Generate conversation ID if not provided
        if not conversation_id:
            import uuid
            conversation_id = str(uuid.uuid4())
        
        return StartupAnalysisResponse(
            conversation_id=conversation_id,
            status="started",
            message="Startup analysis initiated. Connect to WebSocket for real-time updates.",
            websocket_url=f"/api/v1/ws?conversation_id={conversation_id}"
        )
    
    except AutoGenException as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/message")
async def send_simple_message(request: ChatRequest):
    """Send a simple message for basic chat functionality"""
    try:
        # For backward compatibility, maintain simple chat
        return {
            "message": "Please use the /analyze-startup endpoint for the specialized workflow",
            "conversation_id": request.conversation_id or "simple-chat",
            "status": "redirect"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history by ID"""
    try:
        autogen_service = SpecializedAutoGenService()
        conversation = await autogen_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return conversation
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/conversations")
async def list_conversations(limit: int = 10, offset: int = 0):
    """List all conversations with pagination"""
    try:
        autogen_service = SpecializedAutoGenService()
        conversations = await autogen_service.list_conversations(limit=limit, offset=offset)
        return conversations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/conversations/{conversation_id}/status")
async def get_conversation_status(conversation_id: str):
    """Get the current status of a conversation"""
    try:
        autogen_service = SpecializedAutoGenService()
        conversation = await autogen_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {
            "conversation_id": conversation_id,
            "status": conversation.get("status", "unknown"),
            "created_at": conversation.get("created_at"),
            "completed_at": conversation.get("completed_at"),
            "has_final_report": "final_report" in conversation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
