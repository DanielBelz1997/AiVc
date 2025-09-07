"""
Agent management endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.autogen_service import AutoGenService

router = APIRouter()


class AgentConfig(BaseModel):
    name: str
    description: str
    system_message: str
    llm_config: dict
    is_termination_msg: Optional[bool] = False
    code_execution_config: Optional[dict] = None


class AgentResponse(BaseModel):
    agent_id: str
    name: str
    description: str
    status: str
    created_at: str


@router.post("/create", response_model=AgentResponse)
async def create_agent(config: AgentConfig):
    """Create a new agent with specified configuration"""
    try:
        autogen_service = AutoGenService()
        agent = await autogen_service.create_agent(config.dict())
        return agent
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create agent: {str(e)}")


@router.get("/", response_model=List[AgentResponse])
async def list_agents():
    """List all available agents"""
    try:
        autogen_service = AutoGenService()
        agents = await autogen_service.list_agents()
        return agents
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list agents: {str(e)}")


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str):
    """Get agent details by ID"""
    try:
        autogen_service = AutoGenService()
        agent = await autogen_service.get_agent(agent_id)
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return agent
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get agent: {str(e)}")


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, config: AgentConfig):
    """Update agent configuration"""
    try:
        autogen_service = AutoGenService()
        agent = await autogen_service.update_agent(agent_id, config.dict())
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return agent
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update agent: {str(e)}")


@router.delete("/{agent_id}")
async def delete_agent(agent_id: str):
    """Delete an agent by ID"""
    try:
        autogen_service = AutoGenService()
        success = await autogen_service.delete_agent(agent_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return {"message": "Agent deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete agent: {str(e)}")


@router.post("/{agent_id}/reset")
async def reset_agent(agent_id: str):
    """Reset agent conversation history"""
    try:
        autogen_service = AutoGenService()
        success = await autogen_service.reset_agent(agent_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return {"message": "Agent reset successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset agent: {str(e)}")
