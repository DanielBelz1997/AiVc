"use client";

import { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ui/chat-message";
import { TypographyH1 } from "./ui/typographyH1";

interface SimpleAgentConversationProps {
  input: string;
}

export function SimpleAgentConversation({
  input,
}: SimpleAgentConversationProps) {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      agent: "marketing" | "verifier";
      message: string;
      avatarFallback: string;
      side: "left" | "right";
    }>
  >([]);

  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Define the conversation messages
  const conversationMessages = [
    {
      agent: "marketing" as const,
      message: `Great idea! "${input}" has strong market potential. I'm seeing excellent opportunities for user engagement and growth. The value proposition is clear and addresses key market needs.`,
      avatarFallback: "M",
      side: "left" as const,
    },
    {
      agent: "verifier" as const,
      message: `Thanks for the analysis! I've verified the marketing claims and found them to be well-grounded. The market research data supports the projections, and the strategy aligns with current industry trends. Looking good!`,
      avatarFallback: "V",
      side: "right" as const,
    },
    {
      agent: "marketing" as const,
      message: `Perfect! I recommend we focus on the core value propositions: efficiency, cost savings, and user experience. We should target early adopters first, then expand to mainstream market segments.`,
      avatarFallback: "M",
      side: "left" as const,
    },
    {
      agent: "verifier" as const,
      message: `Excellent strategy! Cross-referencing with market data confirms this approach has a 85% success rate in similar launches. All marketing claims are factually accurate and the timeline is realistic. You're good to proceed!`,
      avatarFallback: "V",
      side: "right" as const,
    },
  ];

  useEffect(() => {
    if (currentMessageIndex < conversationMessages.length) {
      const timer = setTimeout(() => {
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `message-${currentMessageIndex}`,
              ...conversationMessages[currentMessageIndex],
            },
          ]);
          setIsTyping(false);
          setCurrentMessageIndex((prev) => prev + 1);
        }, 1500 + Math.random() * 1000); // Random typing delay between 1.5-2.5s
      }, 1000); // 1s delay between messages

      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <TypographyH1 text="Agent Conversation" className="text-white" />
        <p className="text-gray-400 mt-2">
          Marketing Agent and Verifier Agent discussing your request
        </p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 min-h-[400px]">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              avatarFallback={msg.avatarFallback}
              side={msg.side}
              agent={msg.agent}
              className="max-w-[85%]"
            />
          ))}

          {isTyping && (
            <div
              className={`flex gap-3 max-w-[80%] mb-4 ${
                conversationMessages[currentMessageIndex]?.side === "right"
                  ? "ml-auto flex-row-reverse"
                  : "mr-auto"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-border ${
                  conversationMessages[currentMessageIndex]?.agent ===
                  "marketing"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                <span className="text-sm font-medium">
                  {conversationMessages[currentMessageIndex]?.avatarFallback}
                </span>
              </div>
              <div
                className={`rounded-2xl px-4 py-3 shadow-lg ${
                  conversationMessages[currentMessageIndex]?.side === "right"
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

          {messages.length === 0 && !isTyping && (
            <div className="text-center text-gray-400 py-12">
              <p>Starting conversation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
