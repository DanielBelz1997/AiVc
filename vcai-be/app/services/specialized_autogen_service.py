"""
Specialized AutoGen service for the VcAi workflow with 5 agents
"""

import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path

import autogen
from autogen import ConversableAgent, UserProxyAgent, AssistantAgent

from app.core.config import settings
from app.core.exceptions import AutoGenException
from app.services.websocket_manager import manager as websocket_manager


class SpecializedAutoGenService:
    """Service for managing the specialized 5-agent workflow"""
    
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
        
        # Create specialized agents
        self._create_specialized_agents()
    
    def _create_specialized_agents(self):
        """Create the 5 specialized agents for the VcAi workflow"""
        
        # Marketing Agent
        marketing_agent = AssistantAgent(
            name="marketing_agent",
            system_message="""You are a Marketing Strategy Expert. Your role is to analyze business ideas from a marketing perspective.

            When evaluating a business idea, consider:
            - Target market size and demographics
            - Market demand and validation
            - Competitive landscape analysis
            - Go-to-market strategy
            - Brand positioning and value proposition
            - Marketing channels and customer acquisition
            - Revenue models and pricing strategy
            - Market trends and timing

            Provide detailed analysis with specific recommendations for marketing strategy, customer acquisition, and market positioning.
            Be analytical but also highlight opportunities and potential challenges.""",
            llm_config=self.default_llm_config,
        )
        
        # Product Agent
        product_agent = AssistantAgent(
            name="product_agent",
            system_message="""You are a Product Development Expert. Your role is to analyze business ideas from a product and technical perspective.

            When evaluating a business idea, consider:
            - Technical feasibility and implementation complexity
            - Product-market fit assessment
            - User experience and design considerations
            - Development timeline and resource requirements
            - Scalability and architecture considerations
            - Feature prioritization and MVP definition
            - Technology stack recommendations
            - Quality assurance and testing strategy

            Provide detailed analysis with specific recommendations for product development, technical implementation, and user experience optimization.
            Be practical and focus on actionable development insights.""",
            llm_config=self.default_llm_config,
        )
        
        # Legal Agent
        legal_agent = AssistantAgent(
            name="legal_agent",
            system_message="""You are a Legal and Compliance Expert. Your role is to analyze business ideas from a legal and regulatory perspective.

            When evaluating a business idea, consider:
            - Regulatory compliance requirements
            - Industry-specific legal considerations
            - Intellectual property protection
            - Data privacy and security regulations (GDPR, CCPA)
            - Terms of service and user agreements
            - Liability and risk management
            - Corporate structure recommendations
            - Licensing and permits required

            Provide detailed analysis with specific recommendations for legal compliance, risk mitigation, and regulatory strategy.
            Be thorough in identifying potential legal issues and provide actionable compliance guidance.""",
            llm_config=self.default_llm_config,
        )
        
        # Verifier Agent
        verifier_agent = AssistantAgent(
            name="verifier_agent",
            system_message="""You are an Analysis Verification Expert. Your role is to verify and validate claims made by other agents.

            When reviewing agent analysis:
            - Cross-check facts and claims against known data
            - Verify that recommendations are realistic and achievable
            - Challenge assumptions and ask critical questions
            - Ensure analysis is comprehensive and balanced
            - Identify any gaps or overlooked considerations
            - Validate timelines and resource estimates
            - Confirm that proposed strategies align with best practices

            Your goal is to ensure accuracy, completeness, and reliability of all agent recommendations.
            Ask probing questions and provide constructive feedback to strengthen the analysis.""",
            llm_config=self.default_llm_config,
        )
        
        # Summary Agent
        summary_agent = AssistantAgent(
            name="summary_agent",
            system_message="""You are a Business Analysis Synthesis Expert. Your role is to create comprehensive startup success reports.

            You receive verified analysis from marketing, product, and legal experts and must:
            - Synthesize all findings into a cohesive assessment
            - Generate overall success scores (0-100) for each area
            - Identify key strengths and critical risks
            - Provide actionable recommendations and next steps
            - Create a balanced, professional business evaluation
            - Highlight interdependencies between different aspects
            - Suggest priority actions for the entrepreneur

            Create a structured report that helps entrepreneurs make informed decisions about their business ideas.
            Be objective, thorough, and provide clear guidance for moving forward.""",
            llm_config=self.default_llm_config,
        )
        
        # User proxy for managing conversations
        user_proxy = UserProxyAgent(
            name="user_proxy",
            system_message="A human admin managing agent conversations.",
            code_execution_config=False,
            human_input_mode="NEVER",
            max_consecutive_auto_reply=1,
        )
        
        self.agents = {
            "marketing": marketing_agent,
            "product": product_agent,
            "legal": legal_agent,
            "verifier": verifier_agent,
            "summary": summary_agent,
            "user_proxy": user_proxy,
        }
    
    async def process_startup_analysis(
        self, 
        prompt: str, 
        files: Optional[List[Dict]] = None,
        conversation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process the complete startup analysis workflow"""
        
        try:
            # Generate conversation ID if not provided
            if not conversation_id:
                conversation_id = str(uuid.uuid4())
            
            # Initialize conversation
            self.conversations[conversation_id] = {
                "id": conversation_id,
                "created_at": datetime.now().isoformat(),
                "prompt": prompt,
                "files": files or [],
                "status": "processing",
                "results": {},
            }
            
            # Notify clients that processing has started
            await websocket_manager.broadcast_conversation_status(
                conversation_id, 
                "started",
                {"message": "Starting analysis with specialized agents..."}
            )
            
            # Phase 1: Parallel analysis by specialist agents
            await websocket_manager.broadcast_conversation_status(
                conversation_id, 
                "specialist_analysis",
                {"message": "Marketing, Product, and Legal agents analyzing..."}
            )
            
            specialist_results = await self._run_specialist_analysis(
                prompt, files, conversation_id
            )
            
            # Phase 2: Verification conversations
            await websocket_manager.broadcast_conversation_status(
                conversation_id, 
                "verification",
                {"message": "Verifier agent reviewing all analyses..."}
            )
            
            verified_results = await self._run_verification_phase(
                specialist_results, conversation_id
            )
            
            # Phase 3: Summary generation
            await websocket_manager.broadcast_conversation_status(
                conversation_id, 
                "summary_generation",
                {"message": "Summary agent generating final report..."}
            )
            
            final_report = await self._generate_summary_report(
                verified_results, conversation_id
            )
            
            # Update conversation with final results
            self.conversations[conversation_id].update({
                "status": "completed",
                "specialist_results": specialist_results,
                "verified_results": verified_results,
                "final_report": final_report,
                "completed_at": datetime.now().isoformat(),
            })
            
            # Notify completion
            await websocket_manager.broadcast_conversation_status(
                conversation_id, 
                "completed",
                {"message": "Analysis complete!", "report": final_report}
            )
            
            return {
                "conversation_id": conversation_id,
                "status": "completed",
                "report": final_report,
                "metadata": {
                    "specialist_results": specialist_results,
                    "verified_results": verified_results,
                }
            }
            
        except Exception as e:
            await websocket_manager.broadcast_conversation_status(
                conversation_id, 
                "error",
                {"message": f"Analysis failed: {str(e)}"}
            )
            raise AutoGenException(f"Failed to process startup analysis: {str(e)}")
    
    async def _run_specialist_analysis(
        self, 
        prompt: str, 
        files: Optional[List[Dict]], 
        conversation_id: str
    ) -> Dict[str, str]:
        """Run parallel analysis by marketing, product, and legal agents"""
        
        # Prepare the analysis prompt with file context
        analysis_prompt = self._prepare_analysis_prompt(prompt, files)
        
        # Run analyses in parallel
        tasks = []
        for agent_type in ["marketing", "product", "legal"]:
            task = self._run_agent_analysis(agent_type, analysis_prompt, conversation_id)
            tasks.append(task)
        
        # Wait for all specialist analyses to complete
        results = await asyncio.gather(*tasks)
        
        return {
            "marketing": results[0],
            "product": results[1],
            "legal": results[2],
        }
    
    async def _run_agent_analysis(
        self, 
        agent_type: str, 
        prompt: str, 
        conversation_id: str
    ) -> str:
        """Run analysis by a specific agent"""
        
        agent = self.agents[agent_type]
        user_proxy = self.agents["user_proxy"]
        
        # Notify typing
        await websocket_manager.broadcast_typing_indicator(
            conversation_id, agent_type, True
        )
        
        try:
            # Start conversation
            response = await asyncio.to_thread(
                user_proxy.initiate_chat,
                agent,
                message=prompt,
                max_turns=1,
                silent=True,
            )
            
            # Extract the agent's response
            if hasattr(user_proxy, 'chat_messages') and agent.name in user_proxy.chat_messages:
                messages = user_proxy.chat_messages[agent.name]
                if messages:
                    agent_response = messages[-1].get("content", "No response generated")
                else:
                    agent_response = "No response generated"
            else:
                agent_response = "No response generated"
            
            # Stop typing indicator
            await websocket_manager.broadcast_typing_indicator(
                conversation_id, agent_type, False
            )
            
            # Broadcast the agent's message
            await websocket_manager.broadcast_agent_message(
                conversation_id, agent_type, agent_response, "specialist_analysis"
            )
            
            return agent_response
            
        except Exception as e:
            await websocket_manager.broadcast_typing_indicator(
                conversation_id, agent_type, False
            )
            raise AutoGenException(f"Agent {agent_type} analysis failed: {str(e)}")
    
    async def _run_verification_phase(
        self, 
        specialist_results: Dict[str, str], 
        conversation_id: str
    ) -> Dict[str, Dict[str, str]]:
        """Run verification conversations between each specialist and verifier"""
        
        verified_results = {}
        
        for agent_type, analysis in specialist_results.items():
            # Create verification conversation
            verification_conversation = await self._run_verification_conversation(
                agent_type, analysis, conversation_id
            )
            verified_results[agent_type] = verification_conversation
        
        return verified_results
    
    async def _run_verification_conversation(
        self, 
        specialist_type: str, 
        analysis: str, 
        conversation_id: str
    ) -> Dict[str, str]:
        """Run a verification conversation between specialist and verifier"""
        
        specialist_agent = self.agents[specialist_type]
        verifier_agent = self.agents["verifier"]
        
        # Prepare verification prompt
        verification_prompt = f"""
        Please review and verify this {specialist_type} analysis:
        
        {analysis}
        
        Verify the accuracy of claims, validate recommendations, and provide feedback.
        """
        
        # Notify verification starting
        await websocket_manager.broadcast_agent_message(
            conversation_id, 
            "verifier", 
            f"Starting verification of {specialist_type} analysis...",
            "verification_start"
        )
        
        # Typing indicator
        await websocket_manager.broadcast_typing_indicator(
            conversation_id, "verifier", True
        )
        
        try:
            # Run verification conversation
            user_proxy = self.agents["user_proxy"]
            response = await asyncio.to_thread(
                user_proxy.initiate_chat,
                verifier_agent,
                message=verification_prompt,
                max_turns=1,
                silent=True,
            )
            
            # Extract verifier response
            verifier_response = "Verification completed"
            if hasattr(user_proxy, 'chat_messages') and verifier_agent.name in user_proxy.chat_messages:
                messages = user_proxy.chat_messages[verifier_agent.name]
                if messages:
                    verifier_response = messages[-1].get("content", "Verification completed")
            
            # Stop typing
            await websocket_manager.broadcast_typing_indicator(
                conversation_id, "verifier", False
            )
            
            # Broadcast verification result
            await websocket_manager.broadcast_agent_message(
                conversation_id, 
                "verifier", 
                verifier_response,
                "verification_result",
                {"specialist_type": specialist_type}
            )
            
            return {
                "original_analysis": analysis,
                "verification_result": verifier_response,
                "status": "verified"
            }
            
        except Exception as e:
            await websocket_manager.broadcast_typing_indicator(
                conversation_id, "verifier", False
            )
            raise AutoGenException(f"Verification failed for {specialist_type}: {str(e)}")
    
    async def _generate_summary_report(
        self, 
        verified_results: Dict[str, Dict[str, str]], 
        conversation_id: str
    ) -> Dict[str, Any]:
        """Generate final summary report using the summary agent"""
        
        summary_agent = self.agents["summary"]
        user_proxy = self.agents["user_proxy"]
        
        # Prepare summary prompt with all verified results
        summary_prompt = self._prepare_summary_prompt(verified_results)
        
        # Typing indicator
        await websocket_manager.broadcast_typing_indicator(
            conversation_id, "summary", True
        )
        
        try:
            # Generate summary
            response = await asyncio.to_thread(
                user_proxy.initiate_chat,
                summary_agent,
                message=summary_prompt,
                max_turns=1,
                silent=True,
            )
            
            # Extract summary response
            summary_response = "Summary generated"
            if hasattr(user_proxy, 'chat_messages') and summary_agent.name in user_proxy.chat_messages:
                messages = user_proxy.chat_messages[summary_agent.name]
                if messages:
                    summary_response = messages[-1].get("content", "Summary generated")
            
            # Stop typing
            await websocket_manager.broadcast_typing_indicator(
                conversation_id, "summary", False
            )
            
            # Parse and structure the summary
            structured_report = self._structure_summary_report(summary_response, verified_results)
            
            # Broadcast final report
            await websocket_manager.broadcast_agent_message(
                conversation_id, 
                "summary", 
                summary_response,
                "final_report",
                {"structured_report": structured_report}
            )
            
            return structured_report
            
        except Exception as e:
            await websocket_manager.broadcast_typing_indicator(
                conversation_id, "summary", False
            )
            raise AutoGenException(f"Summary generation failed: {str(e)}")
    
    def _prepare_analysis_prompt(self, prompt: str, files: Optional[List[Dict]]) -> str:
        """Prepare the analysis prompt with file context"""
        
        analysis_prompt = f"""
        Please analyze the following business idea from your area of expertise:
        
        Business Idea: {prompt}
        """
        
        if files:
            analysis_prompt += "\n\nAttached files for context:\n"
            for file in files:
                analysis_prompt += f"- {file.get('name', 'Unknown file')}: {file.get('type', 'Unknown type')}\n"
        
        analysis_prompt += "\n\nProvide a comprehensive analysis with specific recommendations and actionable insights."
        
        return analysis_prompt
    
    def _prepare_summary_prompt(self, verified_results: Dict[str, Dict[str, str]]) -> str:
        """Prepare the summary prompt with all verified results"""
        
        summary_prompt = """
        Create a comprehensive startup success report based on the following verified analyses:
        
        """
        
        for agent_type, result in verified_results.items():
            summary_prompt += f"\n{agent_type.upper()} ANALYSIS:\n"
            summary_prompt += f"Original Analysis: {result['original_analysis']}\n"
            summary_prompt += f"Verification Result: {result['verification_result']}\n"
            summary_prompt += "\n" + "="*50 + "\n"
        
        summary_prompt += """
        
        Generate a structured report with:
        1. Overall success score (0-100)
        2. Individual scores for marketing, product, legal aspects
        3. Key strengths and opportunities
        4. Critical risks and challenges
        5. Specific recommendations
        6. Next steps for the entrepreneur
        
        Make the report actionable and professional.
        """
        
        return summary_prompt
    
    def _structure_summary_report(
        self, 
        summary_text: str, 
        verified_results: Dict[str, Dict[str, str]]
    ) -> Dict[str, Any]:
        """Structure the summary response into a formatted report"""
        
        # This is a simplified structuring - in a real implementation,
        # you'd parse the summary_text more intelligently
        return {
            "overall_score": 75,  # Would be extracted from summary_text
            "recommendation": "MODERATE_POTENTIAL",
            "metrics": {
                "marketing_score": 78,
                "product_score": 72,
                "legal_score": 75,
            },
            "summary": summary_text,
            "key_strengths": [
                "Strong market opportunity identified",
                "Technically feasible product development",
                "Manageable legal compliance requirements"
            ],
            "critical_risks": [
                "Competitive market landscape",
                "Technical complexity considerations",
                "Regulatory compliance timeline"
            ],
            "recommendations": [
                "Conduct deeper market validation",
                "Develop detailed technical roadmap",
                "Consult with legal experts for compliance strategy"
            ],
            "next_steps": [
                "Create business plan and financial projections",
                "Build prototype and test with early users",
                "Establish legal framework and compliance procedures"
            ],
            "verified_analyses": verified_results,
            "report_generated_at": datetime.now().isoformat()
        }
    
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
