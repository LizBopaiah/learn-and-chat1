
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  MessageSquare,
  FileText,
  FolderPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

type Folder = {
  id: string;
  name: string;
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>(() => {
    const savedFolders = localStorage.getItem(`folders-${user?.id}`);
    return savedFolders ? JSON.parse(savedFolders) : [{ id: "default", name: "Default Folder" }];
  });
  const [newFolderName, setNewFolderName] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem(`folders-${user?.id}`, JSON.stringify(updatedFolders));
    setNewFolderName("");
    
    toast({
      title: "Folder created",
      description: `${newFolderName} has been created successfully`,
    });
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
            LA
          </div>
          <div className="font-bold text-xl">Learning Assist</div>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-4 py-2 w-full rounded-md ${
                    isActive ? "bg-purple-100 text-purple-500" : "hover:bg-gray-100"
                  }`
                }
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-4 py-2 w-full rounded-md ${
                    isActive ? "bg-purple-100 text-purple-500" : "hover:bg-gray-100"
                  }`
                }
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/chat" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-4 py-2 w-full rounded-md ${
                    isActive ? "bg-purple-100 text-purple-500" : "hover:bg-gray-100"
                  }`
                }
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-6">
          <div className="px-4 py-2 flex items-center justify-between">
            <h2 className="font-semibold text-sm">FOLDERS</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new folder
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input 
                    placeholder="Folder name" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddFolder} className="bg-purple-500 hover:bg-purple-600">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <SidebarMenu>
            {folders.map((folder) => (
              <SidebarMenuItem key={folder.id}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={`/chat/${folder.id}`}
                    className={({ isActive }) => 
                      `flex items-center space-x-2 px-4 py-2 w-full rounded-md ${
                        isActive ? "bg-purple-100 text-purple-500" : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{folder.name}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-medium truncate">{user?.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate("/profile")}>
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
