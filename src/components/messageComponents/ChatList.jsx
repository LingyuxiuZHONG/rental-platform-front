import React from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { API_BASE_URL } from '../commonComponents/Constants';

const ChatList = ({ chats, currentChatId, onSelectChat }) => {
  return (
    <div className="col-span-1 overflow-hidden h-full flex flex-col border-0 shadow-md rounded-xl">
      <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50"> 
        <h3 className="text-lg font-semibold text-gray-800">会话列表</h3>
        <div className="mt-3 relative">
          <input 
            type="text" 
            placeholder="搜索会话..." 
            className="w-full rounded-lg py-2 pl-9 pr-3 bg-white border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all outline-none text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {chats.map((chat) => {
          const otherUser = chat.otherUser;
          const isActive = currentChatId === chat.id;
          
          return (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer transition-all hover:bg-gray-50 border-l-4 ${
                isActive 
                  ? 'border-l-blue-500 bg-blue-50' 
                  : 'border-l-transparent'
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-center gap-3">
                <Avatar className={`h-12 w-12 ring-2 ${isActive ? 'ring-blue-200' : 'ring-gray-100'}`}>
                  <AvatarImage src={`${API_BASE_URL}${otherUser.avatar}`} className="object-cover"/>
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                    {`${otherUser.firstName?.[0]}${otherUser.lastName?.[0]}`}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-medium truncate ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                      {`${otherUser.firstName}${otherUser.lastName}`}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                  </div>
                  <p className={`text-sm truncate mt-1 ${
                    chat.unreadCount > 0 ? 'font-medium text-gray-800' : 'text-gray-500'
                  }`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <Badge className="rounded-full bg-blue-500 hover:bg-blue-600">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
              <Separator className="mt-4 opacity-40" />
            </div>
          );
        })}
        
        {chats.length === 0 && (
          <div className="py-16 px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-500 mb-1">暂无会话</p>
            <p className="text-xs text-gray-400">开始新的对话吧</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;