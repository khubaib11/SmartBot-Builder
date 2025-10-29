import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CreateChatbotFormProps {
  onCreateChatbot: (name: string, description: string) => void;
}

const CreateChatbotForm = ({ onCreateChatbot }: CreateChatbotFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    onCreateChatbot(name, description);
    setName("");
    setDescription("");
    setFile(null);
    
    toast.success("Chatbot created successfully!", {
      description: "Your AI assistant is ready to use"
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("File uploaded successfully");
    }
  };

  return (
    <Card className="border-border/50 bg-gradient-card backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Create New Chatbot</CardTitle>
            <CardDescription className="mt-1">
              Build your AI-powered assistant in minutes
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Chatbot Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Customer Support Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what your chatbot will do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input/50 border-border/50 focus:border-primary transition-all min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-foreground">
              Training Data (Optional)
            </Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
              />
              <Label
                htmlFor="file"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to upload training data"}
                </span>
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-button hover:shadow-glow transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create Chatbot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateChatbotForm;
