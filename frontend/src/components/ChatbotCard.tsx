import { Calendar, MessageSquare, Globe } from "lucide-react";
import BotIcon from "@/components/icons/BotIcon";
import BotFocus from "@/components/icons/BotFocus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChatbotCardProps {
  name: string;
  description: string;
  createdAt: string;
  location: string;
  onChat: () => void;
}

const ChatbotCard = ({ name, description, createdAt, location, onChat }: ChatbotCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-gradient-card backdrop-blur-sm hover:shadow-glow transition-all duration-500 animate-fade-in">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-ai opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <BotFocus className="group-hover:animate-glow-pulse bg-gradient-hero">
            <BotIcon className="text-primary" size={30} />
          </BotFocus>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </CardDescription>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{createdAt}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onChat}
            className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotCard;
