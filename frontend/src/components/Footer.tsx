import BotIcon from "@/components/icons/BotIcon";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 backdrop-blur-xl bg-glass-bg mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
              <BotIcon className="text-white" size={30} />
            
            <span className="text-sm text-muted-foreground">
              © 2025 SmartBot Builder. Powered by AI.
            </span>
          </div>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
