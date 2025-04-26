
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChatInterface from "@/components/chat/ChatInterface";
import { useChat } from "@/context/ChatContext";

const Chat: React.FC = () => {
  const { folderId = "default" } = useParams<{ folderId: string }>();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chat");
  const { chats, setCurrentChat } = useChat();

  useEffect(() => {
    if (chatId) {
      const selectedChat = chats.find(chat => chat.id === chatId);
      if (selectedChat) {
        setCurrentChat(selectedChat);
      }
    } else {
      // If no specific chat ID, try to find any chat in the folder
      const folderChats = chats.filter(chat => chat.folderId === folderId);
      if (folderChats.length > 0) {
        // Use the most recently updated chat
        const sortedChats = [...folderChats].sort(
          (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        setCurrentChat(sortedChats[0]);
      } else {
        setCurrentChat(null);
      }
    }
  }, [chatId, chats, folderId, setCurrentChat]);

  return (
    <div className="h-screen pt-6 px-6 pb-0 flex flex-col">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Chat Assistant</h1>
        <p className="text-gray-600">
          Ask questions about your PDF documents or get general information
        </p>
      </header>

      <div className="flex-1 border rounded-lg overflow-hidden">
        <ChatInterface folderId={folderId} />
      </div>
    </div>
  );
};

export default Chat;
