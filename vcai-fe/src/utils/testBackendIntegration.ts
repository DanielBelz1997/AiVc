/**
 * Utility for testing backend integration
 */

import { backendApi } from "@/services/backendApi";

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export class BackendIntegrationTester {
  static async testHealthCheck(): Promise<IntegrationTestResult> {
    try {
      const health = await backendApi.healthCheck();
      return {
        success: true,
        message: "Backend health check passed",
        details: health,
      };
    } catch (error) {
      return {
        success: false,
        message: "Backend health check failed",
        details: error,
      };
    }
  }

  static async testAgentsList(): Promise<IntegrationTestResult> {
    try {
      const agents = await backendApi.getAgents();
      return {
        success: true,
        message: `Successfully loaded ${agents.length} agents`,
        details: agents,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to load agents",
        details: error,
      };
    }
  }

  static async testWorkflowInfo(): Promise<IntegrationTestResult> {
    try {
      const workflow = await backendApi.getWorkflowInfo();
      return {
        success: true,
        message: "Workflow information loaded successfully",
        details: workflow,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to load workflow information",
        details: error,
      };
    }
  }

  static async testWebSocketConnection(
    conversationId: string
  ): Promise<IntegrationTestResult> {
    return new Promise((resolve) => {
      try {
        const wsUrl = backendApi.getWebSocketUrl(conversationId);
        const ws = new WebSocket(wsUrl);

        const timeout = setTimeout(() => {
          ws.close();
          resolve({
            success: false,
            message: "WebSocket connection timeout",
            details: { url: wsUrl },
          });
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve({
            success: true,
            message: "WebSocket connection successful",
            details: { url: wsUrl },
          });
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          resolve({
            success: false,
            message: "WebSocket connection failed",
            details: { error, url: wsUrl },
          });
        };
      } catch (error) {
        resolve({
          success: false,
          message: "Failed to create WebSocket connection",
          details: error,
        });
      }
    });
  }

  static async runFullIntegrationTest(): Promise<IntegrationTestResult[]> {
    console.log("🧪 Running Backend Integration Tests...");

    const results: IntegrationTestResult[] = [];

    // Test 1: Health Check
    console.log("1. Testing health check...");
    const healthResult = await this.testHealthCheck();
    results.push(healthResult);
    console.log(healthResult.success ? "✅" : "❌", healthResult.message);

    // Test 2: Agents List
    console.log("2. Testing agents list...");
    const agentsResult = await this.testAgentsList();
    results.push(agentsResult);
    console.log(agentsResult.success ? "✅" : "❌", agentsResult.message);

    // Test 3: Workflow Info
    console.log("3. Testing workflow info...");
    const workflowResult = await this.testWorkflowInfo();
    results.push(workflowResult);
    console.log(workflowResult.success ? "✅" : "❌", workflowResult.message);

    // Test 4: WebSocket Connection
    console.log("4. Testing WebSocket connection...");
    const wsResult = await this.testWebSocketConnection("test-conversation-id");
    results.push(wsResult);
    console.log(wsResult.success ? "✅" : "❌", wsResult.message);

    // Summary
    const successCount = results.filter((r) => r.success).length;
    console.log(
      `\n📊 Integration Test Summary: ${successCount}/${results.length} tests passed`
    );

    return results;
  }
}

// Utility function to run tests from browser console
(window as any).testBackendIntegration = () => {
  BackendIntegrationTester.runFullIntegrationTest();
};
