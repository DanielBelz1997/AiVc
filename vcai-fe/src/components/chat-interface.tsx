"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInterfaceProps {
  inputText: string;
}

export function ChatInterface(props: ChatInterfaceProps) {
  const { inputText } = props;

  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Handle message submission here
    console.log("Message:", input);
    setInput("");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-black/80 backdrop-blur-sm rounded-3xl border border-white/20 p-4 shadow-2xl w-2xl">
            <div className="flex items-center max-w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputText}
                className="flex-1 bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 text-xl py-2"
              />

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={!input.trim()}
                className="shrink-0 h-14 w-14 rounded-full bg-white text-black hover:bg-white/90 disabled:bg-white/30 disabled:text-black/50"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
