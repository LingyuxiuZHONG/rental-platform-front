import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Send, MoreHorizontal, Phone, Video, Image } from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const [chats, setChats] = useState([
    {
      id: 1,
      user: {
        name: "Emily Johnson",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      listing: "Luxury Beachfront Villa",
      unread: 2,
      lastMessage: "Hi! I have a question about your beach house availability in August.",
      time: "10:32 AM",
      messages: [
        {
          id: 1,
          sender: "host",
          text: "Welcome to our listing! Let me know if you have any questions.",
          time: "Yesterday, 4:30 PM"
        },
        {
          id: 2,
          sender: "user",
          text: "Hi! I have a question about your beach house availability in August.",
          time: "Today, 10:32 AM"
        },
        {
          id: 3,
          sender: "host",
          text: "Hi Emily! Thanks for your interest. We do have some availability in August. Which dates are you looking at?",
          time: "Today, 10:45 AM"
        }
      ]
    },
    {
      id: 2,
      user: {
        name: "Michael Smith",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      listing: "Downtown Apartment",
      unread: 0,
      lastMessage: "Thanks for the information. I'll let you know about my decision soon.",
      time: "Yesterday",
      messages: [
        {
          id: 1,
          sender: "user",
          text: "Is parking available at the apartment?",
          time: "Yesterday, 2:14 PM"
        },
        {
          id: 2,
          sender: "host",
          text: "Yes, we have a private garage that comes with the apartment. There's space for one vehicle.",
          time: "Yesterday, 2:30 PM"
        },
        {
          id: 3,
          sender: "user",
          text: "Thanks for the information. I'll let you know about my decision soon.",
          time: "Yesterday, 3:45 PM"
        }
      ]
    },
    {
      id: 3,
      user: {
        name: "Jessica Chen",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      listing: "Mountain Cabin Retreat",
      unread: 0,
      lastMessage: "The cabin was amazing! Thank you for being such a great host.",
      time: "Mar 3",
      messages: [
        {
          id: 1,
          sender: "user",
          text: "We've arrived at the cabin. Everything looks beautiful!",
          time: "Mar 1, 3:30 PM"
        },
        {
          id: 2,
          sender: "host",
          text: "Great to hear! Enjoy your stay and let me know if you need anything.",
          time: "Mar 1, 4:12 PM"
        },
        {
          id: 3,
          sender: "user",
          text: "The cabin was amazing! Thank you for being such a great host.",
          time: "Mar 3, 10:24 AM"
        }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: "user",
              text: messageInput,
              time: "Just now"
            }
          ],
          lastMessage: messageInput,
          time: "Just now"
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessageInput('');
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
        {/* Chat list */}
        <Card className="col-span-1 overflow-hidden">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Search conversations" 
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(70vh-6rem)]">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 ${selectedChat === chat.id ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">{chat.user.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1 truncate">{chat.listing}</p>
                    <p className="text-sm truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <Badge className="rounded-full mt-1">{chat.unread}</Badge>
                  )}
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        </Card>

        {/* Chat window */}
        <Card className="col-span-2 flex flex-col">
          {selectedChatData ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedChatData.user.avatar} alt={selectedChatData.user.name} />
                    <AvatarFallback>{selectedChatData.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedChatData.user.name}</h3>
                    <p className="text-sm text-gray-500">{selectedChatData.listing}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {selectedChatData.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' 
                          ? 'text-blue-100' 
                          : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;