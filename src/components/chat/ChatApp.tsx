import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import UsersList from './UsersList';
import { Button } from '@/components/ui/button';
import { Users2 } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
  unreadCount?: number;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  role?: 'owner' | 'admin' | 'moderator' | 'member';
  activity?: string;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}

const ChatApp = () => {
  const { user } = useUser();
  const [currentRoom, setCurrentRoom] = useState('general');
  const [showUsersList, setShowUsersList] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  // Sample data
  const rooms: Room[] = [
    { id: 'general', name: 'general', type: 'text', description: 'General discussion' },
    { id: 'random', name: 'random', type: 'text', description: 'Random conversations', unreadCount: 3 },
    { id: 'announcements', name: 'announcements', type: 'text', description: 'Important updates' },
    { id: 'general-voice', name: 'General Voice', type: 'voice' },
    { id: 'meeting-room', name: 'Meeting Room', type: 'voice' },
  ];

  const users: User[] = [
    { 
      id: '1', 
      name: 'Alex Johnson', 
      status: 'online', 
      role: 'owner',
      activity: 'Building something amazing'
    },
    { 
      id: '2', 
      name: 'Sarah Chen', 
      status: 'online', 
      role: 'admin',
      activity: 'In a meeting'
    },
    { 
      id: '3', 
      name: 'Mike Wilson', 
      status: 'away', 
      role: 'moderator' 
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      status: 'online', 
      role: 'member',
      activity: 'Working on project'
    },
    { 
      id: '5', 
      name: 'Tom Brown', 
      status: 'offline', 
      role: 'member' 
    },
  ];

  // Initialize with welcome messages
  useEffect(() => {
    const welcomeMessages: Message[] = [
      {
        id: '1',
        userId: 'system',
        username: 'Connectify Bot',
        content: `Welcome to #${rooms.find(r => r.id === currentRoom)?.name}! 🎉`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        type: 'system'
      },
      {
        id: '2',
        userId: '1',
        username: 'Alex Johnson',
        content: 'Hey everyone! Welcome to our new chat platform. Feel free to introduce yourselves!',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        type: 'message'
      },
      {
        id: '3',
        userId: '2',
        username: 'Sarah Chen',
        content: 'This looks amazing! Great work on setting this up 👏',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
        type: 'message'
      },
      {
        id: '4',
        userId: '4',
        username: 'Emily Davis',
        content: 'Love the real-time features! The interface is so clean and modern.',
        timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000),
        type: 'message'
      },
      {
        id: '5',
        userId: '1',
        username: 'Alex Johnson',
        content: 'Thanks everyone! We have voice channels too, so feel free to hop in when you want to chat live.',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
        type: 'message'
      },
      {
        id: '6',
        userId: '3',
        username: 'Mike Wilson',
        content: 'The typing indicators and message animations are a nice touch! 🚀',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'message'
      }
    ];

    setMessages(welcomeMessages);
  }, [currentRoom]);

  const handleSendMessage = (content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.fullName || user.firstName || 'Anonymous',
      avatar: user.imageUrl,
      content,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate other users responding (for demo purposes)
    setTimeout(() => {
      const responses = [
        "That's a great point!",
        "I agree with that approach.",
        "Thanks for sharing!",
        "Interesting perspective 🤔",
        "Let me think about that...",
        "Good idea! 👍",
        "Makes sense to me.",
        "I'll look into that.",
      ];

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      if (Math.random() > 0.3) { // 70% chance of response
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          userId: randomUser.id,
          username: randomUser.name,
          content: randomResponse,
          timestamp: new Date(),
          type: 'message'
        };

        setMessages(prev => [...prev, responseMessage]);
      }
    }, 1000 + Math.random() * 3000); // Random delay 1-4 seconds
  };

  const currentRoomData = rooms.find(room => room.id === currentRoom) || rooms[0];

  return (
    <div className="h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <ChatSidebar 
        rooms={rooms}
        users={users.filter(u => u.status === 'online')}
        currentRoom={currentRoom}
        onRoomSelect={setCurrentRoom}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center space-x-4">
            <h1 className="font-semibold text-foreground">
              #{currentRoomData.name}
            </h1>
            {currentRoomData.description && (
              <span className="text-sm text-muted-foreground">
                {currentRoomData.description}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUsersList(!showUsersList)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-4 w-4 mr-2" />
              {users.length}
            </Button>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex">
          <ChatArea 
            room={currentRoomData}
            messages={messages}
            onSendMessage={handleSendMessage}
          />

          {/* Users List */}
          {showUsersList && (
            <UsersList 
              users={users}
              currentRoom={currentRoom}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;