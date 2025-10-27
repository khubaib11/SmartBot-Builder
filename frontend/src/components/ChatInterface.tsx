import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, MessageSquare } from "lucide-react";
import {Bot} from "lucide-react"

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  chatbotName?: string;
}

const ChatInterface = ({ chatbotName }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I'm here to help. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Thank you for your message! I'm processing your request...",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Card className="border-border/50 bg-gradient-card backdrop-blur-sm h-[600px] flex flex-col">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {chatbotName ? `Chat with ${chatbotName}` : "Chat Interface"}
            </CardTitle>
            <CardDescription className="mt-1">
              Start a conversation with the AI assistant
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {message.role === "bot" ? (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full inline-flex items-center justify-center p-1.5 bg-primary/15 border border-primary/30">
                      <Bot className="h-8 w-8 text-primary " />
                    </div>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent/10 border border-accent/20">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg px-4 py-2 ${
                      message.role === "bot"
                        ? "bg-muted/50 text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-input/50 border-border/50 focus:border-primary transition-all"
            />
            <Button 
              type="submit" 
              size="icon"
              className="bg-gradient-button hover:shadow-glow transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
