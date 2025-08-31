import { Crown, Shield, User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  role?: 'owner' | 'admin' | 'moderator' | 'member';
  activity?: string;
}

interface UsersListProps {
  users: User[];
  currentRoom: string;
}

const UsersList = ({ users }: UsersListProps) => {
  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-3 w-3 text-red-500" />;
      case 'moderator':
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'owner':
        return 'text-yellow-500';
      case 'admin':
        return 'text-red-500';
      case 'moderator':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, moderator: 2, member: 3 };
    const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 4;
    const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 4;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (a.status !== b.status) {
      const statusOrder = { online: 0, away: 1, offline: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.name.localeCompare(b.name);
  });

  const onlineUsers = sortedUsers.filter(u => u.status === 'online');
  const awayUsers = sortedUsers.filter(u => u.status === 'away');
  const offlineUsers = sortedUsers.filter(u => u.status === 'offline');

  const UserGroup = ({ title, users, count }: { title: string; users: User[]; count: number }) => (
    <div className="px-2 py-2">
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title} — {count}
        </h3>
      </div>
      
      {users.map((user) => (
        <div key={user.id} className="group flex items-center justify-between px-2 py-1.5 hover:bg-chat-sidebar-hover rounded cursor-pointer">
          <div className="flex items-center min-w-0 flex-1">
            <div className="relative flex-shrink-0">
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
            <div className="ml-3 min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium truncate ${getRoleColor(user.role)}`}>
                  {user.name}
                </span>
                {getRoleIcon(user.role)}
              </div>
              {user.activity && (
                <p className="text-xs text-muted-foreground truncate">{user.activity}</p>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-60 bg-chat-sidebar border-l border-border flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Members</h2>
        <p className="text-sm text-muted-foreground">
          {users.length} member{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      <ScrollArea className="flex-1 chat-scrollbar">
        {onlineUsers.length > 0 && (
          <UserGroup title="Online" users={onlineUsers} count={onlineUsers.length} />
        )}
        
        {awayUsers.length > 0 && (
          <>
            {onlineUsers.length > 0 && <Separator className="my-2" />}
            <UserGroup title="Away" users={awayUsers} count={awayUsers.length} />
          </>
        )}
        
        {offlineUsers.length > 0 && (
          <>
            {(onlineUsers.length > 0 || awayUsers.length > 0) && <Separator className="my-2" />}
            <UserGroup title="Offline" users={offlineUsers} count={offlineUsers.length} />
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default UsersList;