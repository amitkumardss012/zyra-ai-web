"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  Lightbulb,
  Utensils,
  Dumbbell,
  Scale,
  Pill,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/api/api-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ─── Types ─── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ─── Suggestions ─── */
const QUICK_PROMPTS = [
  {
    label: "High protein meals",
    prompt: "What are the best high-protein meals for muscle building?",
    icon: Utensils,
  },
  {
    label: "Pre-workout food",
    prompt: "What should I eat 30 minutes before a workout?",
    icon: Dumbbell,
  },
  {
    label: "Weight loss tips",
    prompt: "Give me a calorie deficit meal plan for weight loss",
    icon: Scale,
  },
  {
    label: "Supplements guide",
    prompt: "What supplements should I take for muscle building?",
    icon: Pill,
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await apiClient.post("/nutrition/chat", {
        messages: content,
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">
              NutriScan AI Assistant
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium">
              Your personal nutrition expert
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full max-w-[480px] mx-auto">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Bot className="w-9 h-9 text-primary/50" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-foreground text-center">
              Ask me anything about nutrition
            </h2>
            <p className="text-xs text-muted-foreground text-center mt-1.5 max-w-[320px]">
              I can help with meal planning, nutrition advice, supplement
              recommendations, and achieving your fitness goals
            </p>
            {/* Quick prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 w-full">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSend(prompt.prompt)}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:bg-primary/2 transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <prompt.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {prompt.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {prompt.prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[720px] mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-primary/20">
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm shadow-lg shadow-primary/10"
                      : "bg-card border border-border/50 text-foreground rounded-tl-sm shadow-xs"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="assistant-message overflow-hidden">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ ...props }) => (
                            <h1
                              className="text-lg font-bold mt-4 mb-2 text-foreground"
                              {...props}
                            />
                          ),
                          h2: ({ ...props }) => (
                            <h2
                              className="text-base font-bold mt-3 mb-1.5 text-foreground"
                              {...props}
                            />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="text-sm font-bold mt-2.5 mb-1 text-foreground"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-2 last:mb-0" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul
                              className="list-disc ml-4 mb-3 space-y-1"
                              {...props}
                            />
                          ),
                          ol: ({ ...props }) => (
                            <ol
                              className="list-decimal ml-4 mb-3 space-y-1"
                              {...props}
                            />
                          ),
                          li: ({ ...props }) => (
                            <li className="mb-0.5" {...props} />
                          ),
                          hr: ({ ...props }) => (
                            <hr
                              className="my-4 border-border/40"
                              {...props}
                            />
                          ),
                          strong: ({ ...props }) => (
                            <strong
                              className="font-bold text-primary/90"
                              {...props}
                            />
                          ),
                          code: ({ ...props }) => (
                            <code
                              className="bg-muted px-1.5 py-0.5 rounded-md text-xs font-mono"
                              {...props}
                            />
                          ),
                          blockquote: ({ ...props }) => (
                            <blockquote
                              className="border-l-2 border-primary/20 pl-4 my-2 italic text-muted-foreground"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                  <p
                    className={cn(
                      "text-[9px] mt-2 font-medium opacity-60",
                      msg.role === "user"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                  <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 md:px-8 py-4 border-t border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-end gap-2 p-2 rounded-2xl border border-border/50 bg-background focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0">
              <Lightbulb className="w-4 h-4 text-muted-foreground/40" />
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about nutrition, meals, supplements..."
              rows={1}
              className="flex-1 min-w-0 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[36px] max-h-[120px] py-1.5"
              style={{ height: "auto" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 shrink-0 mb-0.5",
                input.trim() && !isTyping
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-95"
                  : "bg-muted text-muted-foreground/40"
              )}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center mt-2 font-medium">
            NutriScan AI may make mistakes. Verify important nutrition info.
          </p>
        </div>
      </div>
    </div>
  );
}
