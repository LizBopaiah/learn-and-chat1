
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { FileText, MessageSquare, Mic, Zap } from "lucide-react";

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              LA
            </div>
            <span className="font-bold text-xl">Learning Assistant</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="py-16 md:py-24 container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2 space-y-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Your AI-Powered{" "}
              <span className="text-transparent bg-clip-text purple-gradient">
                Study Companion
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Upload your study materials, ask questions, and get accurate answers instantly. Learning has never been this efficient.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6" 
                size="lg"
                onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4 max-w-md mx-auto md:mx-0">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">PDF Upload</h3>
                  <p className="text-sm text-gray-500">Learn from your own materials</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Smart Chat</h3>
                  <p className="text-sm text-gray-500">Ask questions & get answers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Mic className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Voice Enabled</h3>
                  <p className="text-sm text-gray-500">Talk & listen naturally</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Zap className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Web Search</h3>
                  <p className="text-sm text-gray-500">Fallback to search results</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 opacity-75 blur"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Students studying" 
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section id="auth-section" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Create Your Account</h2>
            <AuthForm />
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Learning Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
