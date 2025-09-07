"""
Pydantic schemas for request/response models
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class BaseSchema(BaseModel):
    """Base schema with common configuration"""
    
    class Config:
        from_attributes = True
        populate_by_name = True


class HealthResponse(BaseSchema):
    status: str
    service: str
    timestamp: Optional[float] = None
    system: Optional[Dict[str, Any]] = None


class ChatMessageSchema(BaseSchema):
    role: str = Field(..., description="Message role: user, assistant, or system")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = None
    agent_name: Optional[str] = None


class ChatRequestSchema(BaseSchema):
    message: str = Field(..., description="User message to process")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID")
    agent_config: Optional[Dict[str, Any]] = Field(None, description="Custom agent configuration")
    max_turns: Optional[int] = Field(3, description="Maximum conversation turns")


class ChatResponseSchema(BaseSchema):
    response: str = Field(..., description="Generated response")
    conversation_id: str = Field(..., description="Conversation identifier")
    agent_responses: List[Dict[str, Any]] = Field(..., description="Individual agent responses")
    metadata: Dict[str, Any] = Field(..., description="Response metadata")


class ConversationSchema(BaseSchema):
    id: str
    created_at: datetime
    messages: List[Dict[str, Any]]
    agents_used: List[str]
    metadata: Optional[Dict[str, Any]] = None


class ConversationListSchema(BaseSchema):
    conversations: List[ConversationSchema]
    total: int
    limit: int
    offset: int


class AgentConfigSchema(BaseSchema):
    name: str = Field(..., description="Agent name")
    description: str = Field("", description="Agent description")
    system_message: str = Field(..., description="System message for the agent")
    llm_config: Dict[str, Any] = Field(..., description="LLM configuration")
    is_termination_msg: Optional[bool] = Field(False, description="Whether agent can terminate conversation")
    code_execution_config: Optional[Dict[str, Any]] = Field(None, description="Code execution configuration")


class AgentResponseSchema(BaseSchema):
    agent_id: str
    name: str
    description: str
    status: str
    created_at: datetime
    metadata: Optional[Dict[str, Any]] = None


class ErrorResponseSchema(BaseSchema):
    error: str
    message: str
    status_code: int
    details: Optional[Dict[str, Any]] = None
