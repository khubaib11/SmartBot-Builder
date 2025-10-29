import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center p-8 rounded-2xl border border-border/50 bg-gradient-card backdrop-blur-sm">
            <h1 className="mb-3 text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              404
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found</p>
            <Link to="/">
              <Button className="bg-gradient-button hover:shadow-glow transition-all duration-300">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
