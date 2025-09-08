"""
WebSocket connection manager for real-time communication
"""

import asyncio
import json
from typing import Dict, List, Optional, Any
from fastapi import WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections and message broadcasting"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.conversation_connections: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected via WebSocket")
    
    def disconnect(self, client_id: str):
        """Remove a WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected from WebSocket")
        
        # Remove from conversation connections
        for conversation_id, clients in self.conversation_connections.items():
            if client_id in clients:
                clients.remove(client_id)
                if not clients:
                    del self.conversation_connections[conversation_id]
                break
    
    def join_conversation(self, client_id: str, conversation_id: str):
        """Add client to a conversation room"""
        if conversation_id not in self.conversation_connections:
            self.conversation_connections[conversation_id] = []
        
        if client_id not in self.conversation_connections[conversation_id]:
            self.conversation_connections[conversation_id].append(client_id)
            logger.info(f"Client {client_id} joined conversation {conversation_id}")
    
    async def send_personal_message(self, message: Dict[str, Any], client_id: str):
        """Send a message to a specific client"""
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)
    
    async def broadcast_to_conversation(self, message: Dict[str, Any], conversation_id: str):
        """Broadcast a message to all clients in a conversation"""
        if conversation_id in self.conversation_connections:
            disconnected_clients = []
            
            for client_id in self.conversation_connections[conversation_id]:
                if client_id in self.active_connections:
                    try:
                        await self.active_connections[client_id].send_text(json.dumps(message))
                    except Exception as e:
                        logger.error(f"Error broadcasting to {client_id}: {e}")
                        disconnected_clients.append(client_id)
                else:
                    disconnected_clients.append(client_id)
            
            # Clean up disconnected clients
            for client_id in disconnected_clients:
                self.disconnect(client_id)
    
    async def broadcast_agent_message(
        self, 
        conversation_id: str, 
        agent_type: str, 
        message: str, 
        message_type: str = "agent_message",
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Broadcast an agent message to conversation participants"""
        message_data = {
            "type": message_type,
            "conversation_id": conversation_id,
            "agent_type": agent_type,
            "message": message,
            "timestamp": asyncio.get_event_loop().time(),
            "metadata": metadata or {}
        }
        
        await self.broadcast_to_conversation(message_data, conversation_id)
    
    async def broadcast_typing_indicator(
        self, 
        conversation_id: str, 
        agent_type: str, 
        is_typing: bool
    ):
        """Broadcast typing indicator for an agent"""
        message_data = {
            "type": "typing_indicator",
            "conversation_id": conversation_id,
            "agent_type": agent_type,
            "is_typing": is_typing,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        await self.broadcast_to_conversation(message_data, conversation_id)
    
    async def broadcast_conversation_status(
        self, 
        conversation_id: str, 
        status: str, 
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Broadcast conversation status updates"""
        message_data = {
            "type": "conversation_status",
            "conversation_id": conversation_id,
            "status": status,
            "timestamp": asyncio.get_event_loop().time(),
            "metadata": metadata or {}
        }
        
        await self.broadcast_to_conversation(message_data, conversation_id)


# Global connection manager instance
manager = ConnectionManager()
