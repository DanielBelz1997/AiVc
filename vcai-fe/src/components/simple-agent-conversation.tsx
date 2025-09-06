import { useRef, useEffect } from "react";

import { ChatMessage } from "@/components/ui/chat-message";
import { TypographyH1 } from "@/components/ui/typographyH1";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMultiConversation } from "@/hooks/useMultiConversation";
import {
  ConversationType,
  CONVERSATION_LABELS,
} from "@/constants/agentConversation";

interface SimpleAgentConversationProps {
  input: string;
}

export function SimpleAgentConversation({
  input,
}: SimpleAgentConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    selectedConversation,
    setSelectedConversation,
    conversations,
    conversationData,
  } = useMultiConversation({ input });

  const currentConversation = conversations[selectedConversation];
  const currentConversationData = conversationData[selectedConversation];

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation.messages, currentConversation.isTyping]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <TypographyH1 text="Agent Conversations" className="text-white" />
        <p className="text-gray-400">
          Multiple agent conversations running simultaneously
        </p>

        <div className="flex justify-center">
          <Select
            value={selectedConversation}
            onValueChange={(value) =>
              setSelectedConversation(value as ConversationType)
            }
          >
            <SelectTrigger className="w-64 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select conversation to view" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {Object.values(ConversationType).map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  {CONVERSATION_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center gap-4 text-sm">
          {Object.values(ConversationType).map((type) => {
            const conversation = conversations[type];
            const isActive = conversation.isTyping;
            const isCompleted = conversation.isComplete;

            return (
              <div
                key={type}
                className={`px-3 py-1 rounded-full border ${
                  type === selectedConversation
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{CONVERSATION_LABELS[type]}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                  {isCompleted && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 h-[500px] flex flex-col">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-white">
            {CONVERSATION_LABELS[selectedConversation]}
          </h3>
          <p className="text-sm text-gray-400">
            {selectedConversation === ConversationType.MARKETING_VERIFIER &&
              "Marketing strategy analysis and verification"}
            {selectedConversation === ConversationType.LEGAL_VERIFIER &&
              "Legal compliance review and verification"}
            {selectedConversation === ConversationType.PRODUCT_VERIFIER &&
              "Product development planning and verification"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 p-6 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-900">
          {currentConversation.messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              avatarFallback={msg.avatarFallback}
              side={msg.side}
              agent={msg.agent}
              className="max-w-[85%]"
            />
          ))}

          {currentConversation.isTyping && (
            <div
              className={`flex gap-3 max-w-[80%] mb-4 ${
                currentConversationData[currentConversation.currentMessageIndex]
                  ?.side === "right"
                  ? "ml-auto flex-row-reverse"
                  : "mr-auto"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-border ${
                  currentConversationData[
                    currentConversation.currentMessageIndex
                  ]?.agent === "marketing"
                    ? "bg-blue-500 text-white"
                    : currentConversationData[
                        currentConversation.currentMessageIndex
                      ]?.agent === "legal"
                    ? "bg-red-500 text-white"
                    : currentConversationData[
                        currentConversation.currentMessageIndex
                      ]?.agent === "product"
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                <span className="text-xs font-bold">
                  {
                    currentConversationData[
                      currentConversation.currentMessageIndex
                    ]?.avatarFallback
                  }
                </span>
              </div>
              <div
                className={`rounded-2xl px-4 py-3 shadow-lg ${
                  currentConversationData[
                    currentConversation.currentMessageIndex
                  ]?.side === "right"
                    ? "bg-primary text-primary-foreground rounded-br-md shadow-primary/20"
                    : "bg-card border border-border text-card-foreground rounded-bl-md shadow-black/10"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {currentConversation.messages.length === 0 &&
            !currentConversation.isTyping && (
              <div className="text-center text-gray-400 py-12">
                <p>Starting conversation...</p>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
