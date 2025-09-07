"""
Chat endpoints for AutoGen integration
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.autogen_service import AutoGenService
from app.core.exceptions import AutoGenException

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    agent_config: Optional[dict] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    agent_responses: List[dict]
    metadata: dict


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message to the AutoGen multi-agent system"""
    try:
        autogen_service = AutoGenService()
        
        result = await autogen_service.process_message(
            message=request.message,
            conversation_id=request.conversation_id,
            agent_config=request.agent_config
        )
        
        return ChatResponse(**result)
    
    except AutoGenException as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history by ID"""
    try:
        autogen_service = AutoGenService()
        conversation = await autogen_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return conversation
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation by ID"""
    try:
        autogen_service = AutoGenService()
        success = await autogen_service.delete_conversation(conversation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/conversations")
async def list_conversations(limit: int = 10, offset: int = 0):
    """List all conversations with pagination"""
    try:
        autogen_service = AutoGenService()
        conversations = await autogen_service.list_conversations(limit=limit, offset=offset)
        return conversations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
