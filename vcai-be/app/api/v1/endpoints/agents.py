"""
Agent management endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.specialized_autogen_service import SpecializedAutoGenService

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


@router.get("/", response_model=List[dict])
async def list_specialized_agents():
    """List all specialized agents in the VcAi workflow"""
    try:
        agents = [
            {
                "agent_id": "marketing",
                "name": "Marketing Agent",
                "description": "Analyzes business ideas from marketing and market opportunity perspective",
                "role": "specialist",
                "status": "active"
            },
            {
                "agent_id": "product",
                "name": "Product Agent", 
                "description": "Evaluates technical feasibility and product development aspects",
                "role": "specialist",
                "status": "active"
            },
            {
                "agent_id": "legal",
                "name": "Legal Agent",
                "description": "Reviews legal compliance and regulatory requirements",
                "role": "specialist", 
                "status": "active"
            },
            {
                "agent_id": "verifier",
                "name": "Verifier Agent",
                "description": "Verifies and validates analysis from specialist agents",
                "role": "verifier",
                "status": "active"
            },
            {
                "agent_id": "summary",
                "name": "Summary Agent",
                "description": "Synthesizes all verified analyses into comprehensive reports",
                "role": "synthesizer",
                "status": "active"
            }
        ]
        return agents
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list agents: {str(e)}")


@router.get("/{agent_id}")
async def get_agent_info(agent_id: str):
    """Get detailed information about a specific agent"""
    agents_info = {
        "marketing": {
            "agent_id": "marketing",
            "name": "Marketing Strategy Expert",
            "description": "Specializes in market analysis, customer acquisition, and business strategy",
            "capabilities": [
                "Market size and opportunity assessment",
                "Target audience identification",
                "Competitive landscape analysis", 
                "Go-to-market strategy development",
                "Revenue model evaluation",
                "Brand positioning recommendations"
            ],
            "role": "specialist",
            "status": "active"
        },
        "product": {
            "agent_id": "product", 
            "name": "Product Development Expert",
            "description": "Focuses on technical feasibility and product development planning",
            "capabilities": [
                "Technical feasibility assessment",
                "Product architecture recommendations",
                "Development timeline estimation",
                "Resource requirement analysis",
                "User experience evaluation",
                "Scalability planning"
            ],
            "role": "specialist",
            "status": "active"
        },
        "legal": {
            "agent_id": "legal",
            "name": "Legal and Compliance Expert", 
            "description": "Ensures regulatory compliance and identifies legal considerations",
            "capabilities": [
                "Regulatory compliance review",
                "Privacy law assessment (GDPR, CCPA)",
                "Intellectual property guidance",
                "Terms of service recommendations",
                "Liability risk evaluation",
                "Corporate structure advice"
            ],
            "role": "specialist",
            "status": "active"
        },
        "verifier": {
            "agent_id": "verifier",
            "name": "Analysis Verification Expert",
            "description": "Validates and fact-checks specialist agent recommendations",
            "capabilities": [
                "Fact verification and validation",
                "Assumption challenge and testing",
                "Completeness assessment",
                "Accuracy confirmation",
                "Best practice validation",
                "Critical gap identification"
            ],
            "role": "verifier", 
            "status": "active"
        },
        "summary": {
            "agent_id": "summary",
            "name": "Business Analysis Synthesizer",
            "description": "Creates comprehensive startup success reports",
            "capabilities": [
                "Multi-perspective synthesis",
                "Success scoring and metrics",
                "Risk-opportunity analysis", 
                "Actionable recommendations",
                "Executive summary creation",
                "Next steps prioritization"
            ],
            "role": "synthesizer",
            "status": "active"
        }
    }
    
    if agent_id not in agents_info:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return agents_info[agent_id]


@router.get("/workflow/status")
async def get_workflow_info():
    """Get information about the VcAi analysis workflow"""
    return {
        "workflow_name": "VcAi Startup Analysis", 
        "description": "Comprehensive startup idea evaluation using specialized AI agents",
        "phases": [
            {
                "phase": 1,
                "name": "Parallel Specialist Analysis",
                "description": "Marketing, Product, and Legal agents analyze the idea simultaneously",
                "agents": ["marketing", "product", "legal"],
                "duration_estimate": "2-5 minutes"
            },
            {
                "phase": 2, 
                "name": "Verification Conversations",
                "description": "Verifier agent reviews each specialist analysis",
                "agents": ["verifier"],
                "interactions": [
                    "marketing ↔ verifier",
                    "product ↔ verifier", 
                    "legal ↔ verifier"
                ],
                "duration_estimate": "3-6 minutes"
            },
            {
                "phase": 3,
                "name": "Summary Report Generation", 
                "description": "Summary agent creates comprehensive startup success report",
                "agents": ["summary"],
                "duration_estimate": "1-2 minutes"
            }
        ],
        "total_duration_estimate": "6-13 minutes",
        "output": "Comprehensive startup success report with scores, recommendations, and next steps"
    }
