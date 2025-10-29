import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotCard from "@/components/ChatbotCard";
import ChatInterface from "@/components/ChatInterface";
import { Sparkles, Globe, MessageSquare, PlusCircle } from "lucide-react";
import BotIcon from "@/components/icons/BotIcon";
import BotFocus from "@/components/icons/BotFocus";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Chatbot {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  location: string;
}

const Dashboard = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/organizations");
      const data = await response.json();

      const formattedBots = data.map((org: any) => ({
        id: org.id,
        name: org.name,
        description: org.description,
        createdAt: new Date(org.created_at).toISOString().split('T')[0],
        location: org.location || "Global"
      }));

      setChatbots(formattedBots);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatWithBot = (botId: string, botName: string) => {
    setSelectedChatbot(botName);
    setSelectedOrgId(botId);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BotFocus className="animate-float bg-gradient-hero">
              <BotIcon className="text-primary" size={58} />
            </BotFocus>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage and create AI-powered chatbots to streamline your workflows
          </p>
        </div>

        {/* Link card to Create Bot page */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-bold text-foreground">Create a New Chatbot</h2>
                </div>
                <p className="text-muted-foreground">
                  Upload a PDF or paste text with your organization details, or set everything up manually using forms.
                </p>
              </div>
              <Link to="/create-bot">
                <Button className="gap-2 bg-gradient-button hover:shadow-glow">
                  <PlusCircle className="h-5 w-5" /> Go to Create Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Global Chatbots Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Chatbots from Around the World</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Explore AI assistants created by users globally. Connect with bots designed for various industries and purposes, from customer support to education and beyond.
          </p>
          
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Loading chatbots...</p>
            </div>
          ) : chatbots.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg bg-gradient-card backdrop-blur-sm">
              <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No chatbots available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatbots.map((bot) => (
                <ChatbotCard
                  key={bot.id}
                  name={bot.name}
                  description={bot.description}
                  createdAt={bot.createdAt}
                  location={bot.location}
                  onChat={() => handleChatWithBot(bot.id, bot.name)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Chat Interface Section (only visible after selecting a bot) */}
        {selectedChatbot && selectedOrgId && (
          <section className="animate-slide-up mt-16" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Live Chat with {selectedChatbot}</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              You're chatting with {selectedChatbot}. Ask anything related to its knowledge and capabilities.
            </p>
            <ChatInterface chatbotName={selectedChatbot} organizationId={selectedOrgId} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
