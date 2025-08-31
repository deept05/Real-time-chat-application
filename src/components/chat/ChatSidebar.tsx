import { Hash, Users, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unreadCount?: number;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
}

interface ChatSidebarProps {
  rooms: Room[];
  users: User[];
  currentRoom: string;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ rooms, users, currentRoom, onRoomSelect }: ChatSidebarProps) => {
  return (
    <div className="w-60 bg-chat-sidebar border-r border-border flex flex-col h-full">
      {/* Server Header */}
      <div className="px-4 py-3 border-b border-border">
        <h1 className="text-white font-semibold text-lg">Connectify Live</h1>
        <p className="text-muted-foreground text-sm">Real-time messaging</p>
      </div>

      <ScrollArea className="flex-1 chat-scrollbar">
        {/* Text Channels */}
        <div className="px-2 py-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Text Channels
            </h3>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {rooms.filter(room => room.type === 'text').map((room) => (
            <Button
              key={room.id}
              variant="ghost"
              className={`w-full justify-between px-2 py-2 mb-1 h-auto ${
                currentRoom === room.id 
                  ? 'bg-chat-message-bg text-foreground' 
                  : 'text-muted-foreground hover:bg-chat-sidebar-hover hover:text-foreground'
              }`}
              onClick={() => onRoomSelect(room.id)}
            >
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-2" />
                <span className="text-sm">{room.name}</span>
              </div>
              {room.unreadCount && room.unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                  {room.unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Voice Channels */}
        <div className="px-2 py-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Voice Channels
            </h3>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {rooms.filter(room => room.type === 'voice').map((room) => (
            <Button
              key={room.id}
              variant="ghost"
              className={`w-full justify-start px-2 py-2 mb-1 h-auto ${
                currentRoom === room.id 
                  ? 'bg-chat-message-bg text-foreground' 
                  : 'text-muted-foreground hover:bg-chat-sidebar-hover hover:text-foreground'
              }`}
              onClick={() => onRoomSelect(room.id)}
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">{room.name}</span>
            </Button>
          ))}
        </div>

        {/* Online Users */}
        <div className="px-2 py-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Online — {users.filter(u => u.status === 'online').length}
            </h3>
          </div>
          
          {users.filter(u => u.status === 'online').map((user) => (
            <div key={user.id} className="flex items-center px-2 py-1 hover:bg-chat-sidebar-hover rounded">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-chat-sidebar ${
                  user.status === 'online' ? 'bg-chat-online' :
                  user.status === 'away' ? 'bg-chat-away' : 'bg-chat-offline'
                }`} />
              </div>
              <span className="ml-3 text-sm text-foreground">{user.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Panel */}
      <div className="px-2 py-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  ME
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-chat-online rounded-full border-2 border-chat-sidebar" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">You</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;