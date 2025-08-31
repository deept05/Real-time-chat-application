import { useState, useRef, useEffect } from "react";
import { Send, Hash, Smile, Paperclip, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface Room {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
}

interface ChatAreaProps {
  room: Room;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatArea = ({ room, messages, onSendMessage }: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const dateKey = message.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center">
          <Hash className="h-5 w-5 text-muted-foreground mr-2" />
          <h2 className="font-semibold text-foreground">{room.name}</h2>
          {room.description && (
            <>
              <Separator orientation="vertical" className="mx-3 h-4" />
              <p className="text-sm text-muted-foreground">{room.description}</p>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 chat-scrollbar">
        <div className="px-4 py-4 space-y-4">
          {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-background px-3 py-1 rounded-md border border-border">
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDate(new Date(dateKey))}
                  </span>
                </div>
              </div>

              {/* Messages for this day */}
              {dayMessages.map((message, index) => {
                const prevMessage = index > 0 ? dayMessages[index - 1] : null;
                const isSequential = prevMessage && 
                  prevMessage.userId === message.userId && 
                  (message.timestamp.getTime() - prevMessage.timestamp.getTime()) < 300000; // 5 minutes

                if (message.type === 'system') {
                  return (
                    <div key={message.id} className="flex justify-center py-2">
                      <div className="bg-muted px-3 py-1 rounded-md">
                        <p className="text-xs text-muted-foreground">{message.content}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={message.id} className={`message-animate group hover:bg-chat-message-hover -mx-4 px-4 py-1 ${isSequential ? 'mt-1' : 'mt-4'}`}>
                    <div className="flex items-start">
                      {!isSequential && (
                        <Avatar className="h-10 w-10 mr-3 mt-1">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {message.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`flex-1 ${isSequential ? 'ml-13' : ''}`}>
                        {!isSequential && (
                          <div className="flex items-baseline mb-1">
                            <span className="font-medium text-foreground mr-2">
                              {message.username}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-foreground leading-relaxed">
                          {message.content}
                        </div>
                      </div>

                      {/* Timestamp on hover for sequential messages */}
                      {isSequential && (
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2 mt-1">
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '400ms' }}></div>
              </div>
              <span className="text-sm text-muted-foreground">Someone is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="px-4 py-4 border-t border-border bg-background">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${room.name}`}
              className="pr-24 bg-chat-input border-0 focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            
            {/* Input Actions */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <Gift className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatArea;