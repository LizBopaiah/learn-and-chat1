
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useChat, PDF } from "@/context/ChatContext";
import PdfUploader from "@/components/pdf/PdfUploader";
import { FileText, Calendar, MessageSquare, Upload, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { pdfs, chats, uploadPdf, createChat, setCurrentChat } = useChat();
  const [isUploading, setIsUploading] = useState(false);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [recentPdfs, setRecentPdfs] = useState<PDF[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get recent chats
    const sortedChats = [...chats].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    setRecentChats(sortedChats.slice(0, 3));

    // Get recent PDFs
    const sortedPdfs = [...pdfs].sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    setRecentPdfs(sortedPdfs.slice(0, 3));
  }, [chats, pdfs]);

  const handlePdfUpload = (file: File, text: string) => {
    const pdf = uploadPdf(file, text);
    setIsUploading(false);

    // Create a new chat for this PDF
    const defaultFolder = "default";
    const chat = createChat(defaultFolder, `Chat about ${file.name}`);

    // Navigate to the chat
    navigate(`/chat/${defaultFolder}?chat=${chat.id}`);
  };

  const handleChatClick = (chat: any) => {
    setCurrentChat(chat);
    navigate(`/chat/${chat.folderId}?chat=${chat.id}`);
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your learning activities.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total PDFs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pdfs.length}</div>
            <p className="text-xs text-muted-foreground">Documents uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chats.length}</div>
            <p className="text-xs text-muted-foreground">Chat conversations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pdfs.length + chats.length > 0
                ? formatDateRelative(
                    [...pdfs.map(p => p.uploadDate), ...chats.map(c => c.lastUpdated)]
                      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
                  )
                : "No activity"}
            </div>
            <p className="text-xs text-muted-foreground">Last activity</p>
          </CardContent>
        </Card>
      </div>

      {isUploading ? (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
          <PdfUploader onUpload={handlePdfUpload} />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsUploading(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center mb-10">
          <Button
            onClick={() => setIsUploading(true)}
            className="bg-purple-500 hover:bg-purple-600"
            size="lg"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload a PDF
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Recent PDFs
          </h2>
          {recentPdfs.length > 0 ? (
            <div className="space-y-4">
              {recentPdfs.map((pdf) => (
                <Card key={pdf.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base truncate">{pdf.name}</CardTitle>
                    <CardDescription>
                      {formatDateRelative(pdf.uploadDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const defaultFolder = "default";
                        const chat = createChat(defaultFolder, `Chat about ${pdf.name}`);
                        navigate(`/chat/${defaultFolder}?chat=${chat.id}`);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" /> Chat about this PDF
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {pdfs.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full text-purple-500 hover:text-purple-700"
                  onClick={() => navigate("/pdfs")}
                >
                  View All PDFs
                </Button>
              )}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">No PDFs uploaded yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsUploading(true)}
                >
                  Upload your first PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" /> Recent Chats
          </h2>
          {recentChats.length > 0 ? (
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <Card
                  key={chat.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleChatClick(chat)}
                >
                  <CardHeader className="py-3">
                    <CardTitle className="text-base truncate">{chat.title}</CardTitle>
                    <CardDescription>
                      {formatDateRelative(chat.lastUpdated)} •{" "}
                      {chat.messages.length} messages
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatClick(chat);
                      }}
                    >
                      Continue Chat
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {chats.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full text-purple-500 hover:text-purple-700"
                  onClick={() => navigate("/chat")}
                >
                  View All Chats
                </Button>
              )}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">No chats yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate("/chat")}
                >
                  Start a new chat
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
