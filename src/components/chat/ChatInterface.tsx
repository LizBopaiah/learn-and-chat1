
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat, Chat, Message } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import VoiceChat from "./VoiceChat";
import { Send } from "lucide-react";
import PdfUploader from "../pdf/PdfUploader";

interface ChatInterfaceProps {
  folderId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ folderId }) => {
  const { user } = useAuth();
  const { currentChat, chats, createChat, sendMessage, uploadPdf } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // If there's no current chat, create one
  useEffect(() => {
    if (!currentChat && user) {
      // Check if there are any existing chats in this folder
      const folderChats = chats.filter(chat => chat.folderId === folderId);
      
      if (folderChats.length > 0) {
        // Use the most recently updated chat
        const sortedChats = [...folderChats].sort(
          (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        // This will trigger the chat context to set the current chat
        createChat(folderId, `New Chat ${sortedChats.length + 1}`);
      } else {
        // Create a new chat if none exist in this folder
        createChat(folderId);
      }
    }
  }, [currentChat, user, folderId, chats, createChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (!isUploading) {
      inputRef.current?.focus();
    }
  }, [isUploading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && currentChat) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handlePdfUpload = (file: File, text: string) => {
    const pdf = uploadPdf(file, text);
    setIsUploading(false);
    
    // If we have a PDF, update the current chat to associate with this PDF
    if (pdf && currentChat) {
      // Since we're using the chat context for this, it will 
      // automatically update the current chat and chats state
      sendMessage(`I've uploaded ${file.name}. Please help me understand its contents.`);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
    inputRef.current?.focus();
  };

  if (!user || !currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {isUploading ? (
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
          <p className="text-gray-600 mb-6">
            Upload a PDF document to start asking questions about its content.
          </p>
          <PdfUploader onUpload={handlePdfUpload} />
          <Button
            variant="outline"
            className="mt-4 self-start"
            onClick={() => setIsUploading(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4">
            {currentChat.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-gray-500 mb-6 max-w-sm">
                  Ask a question about your PDF or upload a new document to get started.
                </p>
                <Button
                  variant="outline"
                  className="mb-2"
                  onClick={() => setIsUploading(true)}
                >
                  Upload PDF
                </Button>
                <p className="text-sm text-gray-400">
                  Or just start typing below to ask a general question
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentChat.messages.map((message: Message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === user.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pr-10"
                />
                <VoiceChat onTranscript={handleVoiceInput} />
              </div>
              <Button type="submit" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsUploading(true)}
              >
                Upload PDF
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
