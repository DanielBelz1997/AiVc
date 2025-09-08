import api from "./axios";

export interface StartupAnalysisRequest {
  prompt: string;
  files?: File[];
  conversation_id?: string;
}

export interface StartupAnalysisResponse {
  conversation_id: string;
  status: string;
  message: string;
  websocket_url: string;
}

export interface ConversationStatus {
  conversation_id: string;
  status: string;
  created_at: string;
  completed_at?: string;
  has_final_report: boolean;
}

export interface AgentInfo {
  agent_id: string;
  name: string;
  description: string;
  role: string;
  status: string;
  capabilities?: string[];
}

export interface WorkflowInfo {
  workflow_name: string;
  description: string;
  phases: Array<{
    phase: number;
    name: string;
    description: string;
    agents: string[];
    duration_estimate: string;
    interactions?: string[];
  }>;
  total_duration_estimate: string;
  output: string;
}

class BackendApiService {
  private baseURL: string;

  constructor() {
    // Use environment variable or default to localhost
    this.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  }

  /**
   * Start a startup analysis workflow
   */
  async startAnalysis(
    request: StartupAnalysisRequest
  ): Promise<StartupAnalysisResponse> {
    const formData = new FormData();
    formData.append("prompt", request.prompt);

    if (request.conversation_id) {
      formData.append("conversation_id", request.conversation_id);
    }

    if (request.files) {
      request.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await fetch(
        `${this.baseURL}/api/v1/chat/analyze-startup`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to start analysis:", error);
      throw error;
    }
  }

  /**
   * Get conversation status
   */
  async getConversationStatus(
    conversationId: string
  ): Promise<ConversationStatus> {
    try {
      const response = await api.get(
        `/api/v1/chat/conversations/${conversationId}/status`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get conversation status:", error);
      throw error;
    }
  }

  /**
   * Get complete conversation data
   */
  async getConversation(conversationId: string): Promise<any> {
    try {
      const response = await api.get(
        `/api/v1/chat/conversations/${conversationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get conversation:", error);
      throw error;
    }
  }

  /**
   * List all conversations
   */
  async listConversations(limit = 10, offset = 0): Promise<any> {
    try {
      const response = await api.get(`/api/v1/chat/conversations`, {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to list conversations:", error);
      throw error;
    }
  }

  /**
   * Get list of available agents
   */
  async getAgents(): Promise<AgentInfo[]> {
    try {
      const response = await api.get("/api/v1/agents/");
      return response.data;
    } catch (error) {
      console.error("Failed to get agents:", error);
      throw error;
    }
  }

  /**
   * Get detailed agent information
   */
  async getAgentInfo(agentId: string): Promise<AgentInfo> {
    try {
      const response = await api.get(`/api/v1/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get agent info:", error);
      throw error;
    }
  }

  /**
   * Get workflow information
   */
  async getWorkflowInfo(): Promise<WorkflowInfo> {
    try {
      const response = await api.get("/api/v1/agents/workflow/status");
      return response.data;
    } catch (error) {
      console.error("Failed to get workflow info:", error);
      throw error;
    }
  }

  /**
   * Get WebSocket URL for a conversation
   */
  getWebSocketUrl(conversationId: string): string {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = this.baseURL.replace(/^https?:\/\//, "");
    return `${wsProtocol}//${host}/api/v1/ws?conversation_id=${conversationId}`;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }
}

export const backendApi = new BackendApiService();
