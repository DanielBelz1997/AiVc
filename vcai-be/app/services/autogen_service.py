"""
AutoGen service for managing multi-agent conversations
"""

import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

import autogen
from autogen import ConversableAgent, UserProxyAgent, AssistantAgent

from app.core.config import settings
from app.core.exceptions import AutoGenException


class AutoGenService:
    """Service for managing AutoGen multi-agent conversations"""
    
    def __init__(self):
        self.conversations: Dict[str, Dict] = {}
        self.agents: Dict[str, ConversableAgent] = {}
        self.work_dir = Path(settings.AUTOGEN_WORK_DIR)
        self.work_dir.mkdir(exist_ok=True)
        
        # Initialize default LLM config
        self.default_llm_config = {
            "model": settings.OPENAI_MODEL,
            "api_key": settings.OPENAI_API_KEY,
            "cache_seed": settings.AUTOGEN_CACHE_SEED,
        }
        
        # Create default agents
        self._create_default_agents()
    
    def _create_default_agents(self):
        """Create default agents for the system"""
        
        # User proxy agent
        user_proxy = UserProxyAgent(
            name="user_proxy",
            system_message="A human admin. Interact with the planner to discuss the plan. Plan execution needs to be approved by this admin.",
            code_execution_config={
                "work_dir": str(self.work_dir),
                "use_docker": False,
            },
            human_input_mode="NEVER",
            max_consecutive_auto_reply=3,
        )
        
        # Assistant agent
        assistant = AssistantAgent(
            name="assistant",
            system_message="You are a helpful AI assistant. You can help with various tasks including analysis, planning, and problem-solving.",
            llm_config=self.default_llm_config,
        )
        
        # Planner agent
        planner = AssistantAgent(
            name="planner",
            system_message="""You are a planner. Given a task, please determine what information is needed to complete the task.
            Please note that the information will be provided by other agents, and you should not assume that you have access to external tools or APIs unless explicitly mentioned.
            After each step, please clearly state what information is needed next.""",
            llm_config=self.default_llm_config,
        )
        
        # Code reviewer agent
        code_reviewer = AssistantAgent(
            name="code_reviewer",
            system_message="""You are a code reviewer. Review the code and provide feedback.
            Focus on code quality, best practices, security, and potential improvements.""",
            llm_config=self.default_llm_config,
        )
        
        self.agents = {
            "user_proxy": user_proxy,
            "assistant": assistant,
            "planner": planner,
            "code_reviewer": code_reviewer,
        }
    
    async def process_message(
        self, 
        message: str, 
        conversation_id: Optional[str] = None,
        agent_config: Optional[dict] = None
    ) -> Dict[str, Any]:
        """Process a message through the AutoGen system"""
        
        try:
            # Generate conversation ID if not provided
            if not conversation_id:
                conversation_id = str(uuid.uuid4())
            
            # Initialize conversation if it doesn't exist
            if conversation_id not in self.conversations:
                self.conversations[conversation_id] = {
                    "id": conversation_id,
                    "created_at": datetime.now().isoformat(),
                    "messages": [],
                    "agents_used": [],
                }
            
            # Get or create agents for this conversation
            user_proxy = self.agents["user_proxy"]
            assistant = self.agents["assistant"]
            
            # Start the conversation
            response = await asyncio.to_thread(
                user_proxy.initiate_chat,
                assistant,
                message=message,
                max_turns=3,
            )
            
            # Extract agent responses
            agent_responses = []
            if hasattr(user_proxy, 'chat_messages') and assistant.name in user_proxy.chat_messages:
                for msg in user_proxy.chat_messages[assistant.name]:
                    agent_responses.append({
                        "agent": msg.get("name", "unknown"),
                        "content": msg.get("content", ""),
                        "role": msg.get("role", "assistant"),
                    })
            
            # Get the final response
            final_response = agent_responses[-1]["content"] if agent_responses else "No response generated"
            
            # Update conversation history
            conversation_entry = {
                "timestamp": datetime.now().isoformat(),
                "user_message": message,
                "agent_responses": agent_responses,
                "response": final_response,
            }
            
            self.conversations[conversation_id]["messages"].append(conversation_entry)
            self.conversations[conversation_id]["agents_used"] = list(set(
                self.conversations[conversation_id]["agents_used"] + 
                [resp["agent"] for resp in agent_responses]
            ))
            
            return {
                "response": final_response,
                "conversation_id": conversation_id,
                "agent_responses": agent_responses,
                "metadata": {
                    "agents_used": self.conversations[conversation_id]["agents_used"],
                    "message_count": len(self.conversations[conversation_id]["messages"]),
                }
            }
            
        except Exception as e:
            raise AutoGenException(f"Failed to process message: {str(e)}")
    
    async def get_conversation(self, conversation_id: str) -> Optional[Dict]:
        """Get conversation by ID"""
        return self.conversations.get(conversation_id)
    
    async def list_conversations(self, limit: int = 10, offset: int = 0) -> Dict:
        """List conversations with pagination"""
        conversations = list(self.conversations.values())
        total = len(conversations)
        
        # Sort by creation date (newest first)
        conversations.sort(key=lambda x: x["created_at"], reverse=True)
        
        # Apply pagination
        paginated = conversations[offset:offset + limit]
        
        return {
            "conversations": paginated,
            "total": total,
            "limit": limit,
            "offset": offset,
        }
    
    async def delete_conversation(self, conversation_id: str) -> bool:
        """Delete conversation by ID"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            return True
        return False
    
    async def create_agent(self, config: Dict) -> Dict:
        """Create a new agent with specified configuration"""
        try:
            agent_id = str(uuid.uuid4())
            
            # Create agent based on configuration
            if config.get("code_execution_config"):
                agent = UserProxyAgent(
                    name=config["name"],
                    system_message=config["system_message"],
                    code_execution_config=config["code_execution_config"],
                    llm_config=config.get("llm_config", self.default_llm_config),
                )
            else:
                agent = AssistantAgent(
                    name=config["name"],
                    system_message=config["system_message"],
                    llm_config=config.get("llm_config", self.default_llm_config),
                )
            
            self.agents[agent_id] = agent
            
            return {
                "agent_id": agent_id,
                "name": config["name"],
                "description": config.get("description", ""),
                "status": "active",
                "created_at": datetime.now().isoformat(),
            }
            
        except Exception as e:
            raise AutoGenException(f"Failed to create agent: {str(e)}")
    
    async def list_agents(self) -> List[Dict]:
        """List all available agents"""
        agents = []
        for agent_id, agent in self.agents.items():
            agents.append({
                "agent_id": agent_id,
                "name": agent.name,
                "description": getattr(agent, "description", ""),
                "status": "active",
                "created_at": datetime.now().isoformat(),
            })
        return agents
    
    async def get_agent(self, agent_id: str) -> Optional[Dict]:
        """Get agent by ID"""
        if agent_id in self.agents:
            agent = self.agents[agent_id]
            return {
                "agent_id": agent_id,
                "name": agent.name,
                "description": getattr(agent, "description", ""),
                "status": "active",
                "created_at": datetime.now().isoformat(),
            }
        return None
    
    async def update_agent(self, agent_id: str, config: Dict) -> Optional[Dict]:
        """Update agent configuration"""
        if agent_id not in self.agents:
            return None
        
        # For simplicity, we'll recreate the agent with new config
        # In a production system, you might want more sophisticated updating
        try:
            del self.agents[agent_id]
            new_agent_data = await self.create_agent(config)
            # Keep the same ID
            self.agents[agent_id] = self.agents[new_agent_data["agent_id"]]
            del self.agents[new_agent_data["agent_id"]]
            
            new_agent_data["agent_id"] = agent_id
            return new_agent_data
            
        except Exception as e:
            raise AutoGenException(f"Failed to update agent: {str(e)}")
    
    async def delete_agent(self, agent_id: str) -> bool:
        """Delete agent by ID"""
        if agent_id in self.agents and agent_id not in ["user_proxy", "assistant", "planner", "code_reviewer"]:
            del self.agents[agent_id]
            return True
        return False
    
    async def reset_agent(self, agent_id: str) -> bool:
        """Reset agent conversation history"""
        if agent_id in self.agents:
            agent = self.agents[agent_id]
            if hasattr(agent, 'reset'):
                agent.reset()
                return True
        return False
