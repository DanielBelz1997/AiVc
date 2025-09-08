#!/usr/bin/env python3
"""
Test script for the VcAi specialized workflow
"""

import asyncio
import json
import websockets
import requests
import time
from typing import Dict, Any

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000"


async def test_websocket_connection(conversation_id: str):
    """Test WebSocket connection and listen for updates"""
    uri = f"{WS_URL}/api/v1/ws?conversation_id={conversation_id}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print(f"📡 Connected to WebSocket for conversation: {conversation_id}")
            
            # Listen for messages
            async for message in websocket:
                try:
                    data = json.loads(message)
                    message_type = data.get("type", "unknown")
                    
                    if message_type == "connection_established":
                        print(f"✅ WebSocket connection established")
                    
                    elif message_type == "conversation_status":
                        status = data.get("status")
                        msg = data.get("metadata", {}).get("message", "")
                        print(f"📊 Status Update: {status} - {msg}")
                    
                    elif message_type == "typing_indicator":
                        agent = data.get("agent_type")
                        is_typing = data.get("is_typing")
                        status = "typing..." if is_typing else "finished"
                        print(f"💭 {agent} is {status}")
                    
                    elif message_type == "agent_message":
                        agent = data.get("agent_type")
                        message_content = data.get("message", "")[:100] + "..."
                        msg_type = data.get("message_type", "message")
                        print(f"🤖 {agent} ({msg_type}): {message_content}")
                    
                    elif message_type == "final_report":
                        print(f"📋 Final Report Generated!")
                        structured_report = data.get("metadata", {}).get("structured_report", {})
                        if structured_report:
                            print(f"   Overall Score: {structured_report.get('overall_score', 'N/A')}")
                            print(f"   Recommendation: {structured_report.get('recommendation', 'N/A')}")
                        break
                    
                    else:
                        print(f"📨 Received: {message_type}")
                
                except json.JSONDecodeError:
                    print(f"❌ Invalid JSON: {message}")
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
    
    except Exception as e:
        print(f"❌ WebSocket error: {e}")


def test_api_endpoints():
    """Test the REST API endpoints"""
    
    print("🧪 Testing API Endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
    
    # Test agents list
    try:
        response = requests.get(f"{BASE_URL}/api/v1/agents/")
        agents = response.json()
        print(f"✅ Agents loaded: {len(agents)} agents available")
        for agent in agents:
            print(f"   - {agent['name']} ({agent['role']})")
    except Exception as e:
        print(f"❌ Agents list failed: {e}")
    
    # Test workflow info
    try:
        response = requests.get(f"{BASE_URL}/api/v1/agents/workflow/status")
        workflow = response.json()
        print(f"✅ Workflow info loaded: {workflow['workflow_name']}")
        print(f"   Total duration: {workflow['total_duration_estimate']}")
    except Exception as e:
        print(f"❌ Workflow info failed: {e}")


async def test_startup_analysis():
    """Test the complete startup analysis workflow"""
    
    print("\n🚀 Testing Startup Analysis Workflow...")
    
    # Prepare test data
    test_prompt = """
    I want to create a mobile app that uses AI to help people find the best local restaurants 
    based on their dietary preferences, budget, and location. The app would use machine learning 
    to learn user preferences over time and provide personalized recommendations.
    
    Key features:
    - AI-powered restaurant recommendations
    - Dietary restriction filtering (vegan, gluten-free, etc.)
    - Budget-based suggestions
    - Real-time availability and booking
    - Social sharing and reviews
    - Integration with delivery services
    """
    
    # Start the analysis
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/chat/analyze-startup",
            data={"prompt": test_prompt}
        )
        
        if response.status_code == 200:
            result = response.json()
            conversation_id = result["conversation_id"]
            print(f"✅ Analysis started: {result['message']}")
            print(f"📝 Conversation ID: {conversation_id}")
            print(f"🔗 WebSocket URL: {result['websocket_url']}")
            
            # Connect to WebSocket and listen for updates
            await test_websocket_connection(conversation_id)
            
            # After analysis, check the final result
            await asyncio.sleep(2)  # Give it a moment to complete
            
            try:
                final_response = requests.get(f"{BASE_URL}/api/v1/chat/conversations/{conversation_id}")
                if final_response.status_code == 200:
                    conversation = final_response.json()
                    print(f"\n📊 Final Analysis Results:")
                    print(f"   Status: {conversation.get('status', 'Unknown')}")
                    if 'final_report' in conversation:
                        report = conversation['final_report']
                        print(f"   Overall Score: {report.get('overall_score', 'N/A')}")
                        print(f"   Recommendation: {report.get('recommendation', 'N/A')}")
                        print(f"   Key Strengths: {len(report.get('key_strengths', []))} identified")
                        print(f"   Critical Risks: {len(report.get('critical_risks', []))} identified")
                        print(f"   Recommendations: {len(report.get('recommendations', []))} provided")
                        print(f"   Next Steps: {len(report.get('next_steps', []))} outlined")
            except Exception as e:
                print(f"❌ Failed to get final results: {e}")
        
        else:
            print(f"❌ Analysis failed: {response.status_code} - {response.text}")
    
    except Exception as e:
        print(f"❌ Analysis request failed: {e}")


async def main():
    """Main test function"""
    print("🎯 VcAi Backend Workflow Test")
    print("=" * 50)
    
    # Test basic API endpoints
    test_api_endpoints()
    
    print("\n" + "=" * 50)
    
    # Test the complete workflow
    await test_startup_analysis()
    
    print("\n✅ Test completed!")


if __name__ == "__main__":
    print("Starting VcAi Backend Test...")
    print("Make sure the backend server is running on localhost:8000")
    print("Press Ctrl+C to stop\n")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
