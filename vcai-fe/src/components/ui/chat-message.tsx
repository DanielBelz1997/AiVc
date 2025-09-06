"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgentType } from "@/constants";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  avatarSrc?: string;
  avatarFallback?: string;
  message: string;
  side?: "left" | "right";
  className?: string;
  agent?: AgentType;
}

export function ChatMessage({
  avatarSrc,
  avatarFallback = "U",
  message,
  side = "left",
  className,
  agent,
}: ChatMessageProps) {
  const isRight = side === "right";

  const getAvatarColor = () => {
    if (agent === AgentType.MARKETING) return "bg-blue-500 text-white";
    if (agent === AgentType.VERIFIER) return "bg-green-500 text-white";
    if (agent === AgentType.PRODUCT) return "bg-yellow-500 text-white";
    if (agent === AgentType.LEGAL) return "bg-red-500 text-white";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%] mb-4",
        isRight ? "ml-auto flex-row-reverse" : "mr-auto",
        className
      )}
    >
      <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-border">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} />
        <AvatarFallback className={`text-xs font-bold ${getAvatarColor()}`}>
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm shadow-lg",
          isRight
            ? "bg-primary text-primary-foreground rounded-br-md shadow-primary/20"
            : "bg-card border border-border text-card-foreground rounded-bl-md shadow-black/10"
        )}
      >
        <p className="text-balance leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
