
import React from "react";
import { Message } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { FileText, Globe } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const sourceIcon = message.isFromPdf ? (
    <FileText className="h-4 w-4 text-blue-500" />
  ) : message.isFromWeb ? (
    <Globe className="h-4 w-4 text-purple-500" />
  ) : null;

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-2 py-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-2",
          isCurrentUser
            ? "bg-purple-500 text-white"
            : "bg-gray-100 text-gray-800"
        )}
      >
        <div className="whitespace-pre-wrap text-sm">{message.text}</div>
        
        {(message.isFromPdf || message.isFromWeb) && (
          <div className="flex items-center gap-1 text-xs opacity-70">
            {sourceIcon}
            <span>
              {message.isFromPdf
                ? "From your document"
                : "From web search"}
            </span>
          </div>
        )}
        
        <div className="text-xs opacity-50 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
