
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type PDF = {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  content: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isFromPdf: boolean;
  isFromWeb?: boolean;
};

export type Chat = {
  id: string;
  folderId: string;
  title: string;
  messages: Message[];
  pdfId?: string;
  lastUpdated: string;
};

type ChatContextType = {
  pdfs: PDF[];
  chats: Chat[];
  currentChat: Chat | null;
  uploadPdf: (file: File, content: string) => void;
  createChat: (folderId: string, title?: string) => Chat;
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (text: string) => void;
  getChatsByFolderId: (folderId: string) => Chat[];
  renameChat: (chatId: string, newTitle: string) => void;
  deleteChat: (chatId: string) => void;
  getPdfById: (pdfId?: string) => PDF | undefined;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  // Load data from localStorage when the user changes
  useEffect(() => {
    if (user) {
      const storedPdfs = localStorage.getItem(`pdfs-${user.id}`);
      const storedChats = localStorage.getItem(`chats-${user.id}`);
      
      if (storedPdfs) {
        setPdfs(JSON.parse(storedPdfs));
      }
      
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } else {
      setPdfs([]);
      setChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`pdfs-${user.id}`, JSON.stringify(pdfs));
    }
  }, [user, pdfs]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`chats-${user.id}`, JSON.stringify(chats));
    }
  }, [user, chats]);

  const uploadPdf = (file: File, content: string) => {
    if (!user) return;
    
    const newPdf: PDF = {
      id: `pdf-${Date.now()}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      content: content,
    };
    
    setPdfs((prevPdfs) => [...prevPdfs, newPdf]);
    return newPdf;
  };

  const createChat = (folderId: string, title?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      folderId,
      title: title || `New Chat ${chats.length + 1}`,
      messages: [],
      lastUpdated: new Date().toISOString(),
    };
    
    setChats((prevChats) => [...prevChats, newChat]);
    setCurrentChat(newChat);
    return newChat;
  };

  const getPdfById = (pdfId?: string) => {
    if (!pdfId) return undefined;
    return pdfs.find(pdf => pdf.id === pdfId);
  };

  const simulateAssistantResponse = (text: string, pdfId?: string): Promise<Message> => {
    // In a real app, this would be an API call to a backend service
    return new Promise((resolve) => {
      const pdf = pdfId ? pdfs.find(p => p.id === pdfId) : undefined;
      
      setTimeout(() => {
        // Check if the question can be answered from the PDF
        const isFromPdf = pdf && Math.random() > 0.3; // Randomly determine if answer is from PDF
        
        let response: string;
        if (isFromPdf) {
          response = `Based on the document "${pdf?.name}", the answer to your question is: This is a simulated response that would come from processing the text content of the PDF using NLP techniques. In a real application, we would use more sophisticated algorithms to extract relevant information from the PDF content.`;
        } else {
          response = `I couldn't find the exact answer in your uploaded documents. Based on web search: This is a simulated web search result that would come from using a search API like Google Programmable Search. In a real application, we would make API calls to external services to provide fallback information when the PDF doesn't contain the answer.`;
        }
        
        resolve({
          id: `msg-${Date.now()}`,
          senderId: 'assistant',
          text: response,
          timestamp: new Date().toISOString(),
          isFromPdf: !!isFromPdf,
          isFromWeb: !isFromPdf,
        });
      }, 1500); // Simulate API delay
    });
  };

  const sendMessage = async (text: string) => {
    if (!user || !currentChat) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
      isFromPdf: false,
    };
    
    // Update the current chat with the new message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      lastUpdated: new Date().toISOString(),
    };
    setCurrentChat(updatedChat);
    
    // Update the chat in the chats array
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );
    
    // Get assistant response
    try {
      const assistantMessage = await simulateAssistantResponse(text, currentChat.pdfId);
      
      // Update the current chat with the assistant message
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        lastUpdated: new Date().toISOString(),
      };
      
      setCurrentChat(finalChat);
      
      // Update the chat in the chats array
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id ? finalChat : chat
        )
      );
    } catch (error) {
      console.error("Error getting assistant response:", error);
    }
  };

  const getChatsByFolderId = (folderId: string) => {
    return chats.filter(chat => chat.folderId === folderId);
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
    
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat({ ...currentChat, title: newTitle });
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        pdfs,
        chats,
        currentChat,
        uploadPdf,
        createChat,
        setCurrentChat,
        sendMessage,
        getChatsByFolderId,
        renameChat,
        deleteChat,
        getPdfById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
