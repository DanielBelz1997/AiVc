"""
WebSocket endpoints for real-time communication
"""

import asyncio
import json
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Optional

from app.services.websocket_manager import manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: Optional[str] = Query(None),
    conversation_id: Optional[str] = Query(None)
):
    """WebSocket endpoint for real-time communication"""
    
    # Generate client ID if not provided
    if not client_id:
        client_id = str(uuid.uuid4())
    
    try:
        # Accept connection
        await manager.connect(websocket, client_id)
        
        # Join conversation if specified
        if conversation_id:
            manager.join_conversation(client_id, conversation_id)
            await manager.send_personal_message(
                {
                    "type": "connection_established",
                    "client_id": client_id,
                    "conversation_id": conversation_id,
                    "message": "Connected to conversation"
                },
                client_id
            )
        else:
            await manager.send_personal_message(
                {
                    "type": "connection_established",
                    "client_id": client_id,
                    "message": "WebSocket connection established"
                },
                client_id
            )
        
        # Keep connection alive and handle messages
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                await handle_websocket_message(client_id, message)
                
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received from client {client_id}")
                await manager.send_personal_message(
                    {
                        "type": "error",
                        "message": "Invalid JSON format"
                    },
                    client_id
                )
            except Exception as e:
                logger.error(f"Error handling message from {client_id}: {e}")
                await manager.send_personal_message(
                    {
                        "type": "error",
                        "message": f"Error processing message: {str(e)}"
                    },
                    client_id
                )
    
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket error for client {client_id}: {e}")
    finally:
        manager.disconnect(client_id)


async def handle_websocket_message(client_id: str, message: dict):
    """Handle incoming WebSocket messages"""
    
    message_type = message.get("type")
    
    if message_type == "join_conversation":
        conversation_id = message.get("conversation_id")
        if conversation_id:
            manager.join_conversation(client_id, conversation_id)
            await manager.send_personal_message(
                {
                    "type": "joined_conversation",
                    "conversation_id": conversation_id,
                    "message": f"Joined conversation {conversation_id}"
                },
                client_id
            )
    
    elif message_type == "ping":
        await manager.send_personal_message(
            {
                "type": "pong",
                "timestamp": asyncio.get_event_loop().time()
            },
            client_id
        )
    
    elif message_type == "subscribe_updates":
        # Client wants to receive updates for specific conversation
        conversation_id = message.get("conversation_id")
        if conversation_id:
            manager.join_conversation(client_id, conversation_id)
    
    else:
        logger.warning(f"Unknown message type: {message_type} from client {client_id}")
        await manager.send_personal_message(
            {
                "type": "error",
                "message": f"Unknown message type: {message_type}"
            },
            client_id
        )
