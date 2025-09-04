"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, CheckCircle, AlertCircle } from "lucide-react";
import { useAgentsFlow, type WorkflowState } from "@/hooks/useAgentsFlow";
import { TypographyH1 } from "./ui/typographyH1";

export interface AgentsFlowProps {
  input: string;
  setInput: (input: string) => void;
  workflow: WorkflowState;
  handleEditResponse: (responseId: string) => void;
  editText: string;
  setEditText: (editText: string) => void;
  editingResponse: string | null;
  setEditingResponse: (editingResponse: string | null) => void;
}

export function AIAgentWorkflow(props: AgentsFlowProps) {
  const { agents, TypingIndicator } = useAgentsFlow();
  const {
    workflow,
    handleEditResponse,
    editText,
    setEditText,
    editingResponse,
    setEditingResponse,
  } = props;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <TypographyH1 text="AI Agent Working Flow" className="text-white" />
      </div>

      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">AI Agents</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(agents).map(([key, agent]) => (
            <div
              key={key}
              className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-gray-700/50"
            >
              <Avatar
                className={`w-12 h-12 ${agent.color} ${
                  workflow.currentAgent === key
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                } transition-all duration-300`}
              >
                <AvatarFallback className={agent.color}>
                  {agent.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-200">
                  {agent.name}
                </p>
                <p className="text-xs text-gray-400">{agent.role}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {agent.description}
                </p>
              </div>
              {workflow.currentAgent === key && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {workflow.responses.length > 0 && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">
            Agent Analysis
          </h3>
          <div className="space-y-6">
            {workflow.responses.map((response) => {
              const agent = agents[response.agent];
              return (
                <div key={response.id} className="border-l-2 border-muted pl-4">
                  <div className="flex items-start space-x-3">
                    <Avatar
                      className={`w-10 h-10 ${agent.color} flex-shrink-0`}
                    >
                      <AvatarFallback className={agent.color}>
                        {agent.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">
                            {agent.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs text-white"
                          >
                            {agent.role}
                          </Badge>
                          {response.status === "complete" && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {response.status === "corrected" && (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        {response.isEditable &&
                          response.status === "complete" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditResponse(response.id)}
                              className="text-xs"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Correct
                            </Button>
                          )}
                      </div>

                      {response.status === "thinking" && (
                        <div className="flex items-center space-x-2 text-white">
                          <TypingIndicator />
                          <span className="text-sm">
                            Analyzing your request...
                          </span>
                        </div>
                      )}

                      {response.status === "responding" && (
                        <div className="flex items-center space-x-2 text-white">
                          <TypingIndicator />
                          <span className="text-sm">
                            Generating response...
                          </span>
                        </div>
                      )}

                      {(response.status === "complete" ||
                        response.status === "corrected") && (
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          {editingResponse === response.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-2 text-sm text-white bg-transparent border border-gray-600 rounded resize-none"
                                rows={4}
                              />
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => {}}>
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingResponse(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-white leading-relaxed">
                              {response.text}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {workflow.verifierConclusion && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="flex items-start space-x-3">
            <Avatar
              className={`w-12 h-12 ${agents.verifier.color} flex-shrink-0`}
            >
              <AvatarFallback className={agents.verifier.color}>
                {agents.verifier.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <span className="font-semibold text-white">
                  {agents.verifier.name}
                </span>
                <Badge className="bg-primary text-primary-foreground">
                  Final Verification
                </Badge>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                <p className="text-sm text-white leading-relaxed font-medium">
                  {workflow.verifierConclusion}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
