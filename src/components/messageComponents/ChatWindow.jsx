// ChatWindow.jsx - 右侧聊天窗口组件
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Phone, Video, MoreHorizontal, Image as ImageIcon, ExternalLink, Paperclip, Smile } from "lucide-react";
import { API_BASE_URL } from '../commonComponents/Constants';

const ChatWindow = ({ currentChat, messages, currentUser, onSendMessage, listing }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    onSendMessage(messageInput);
    setMessageInput('');
  };
  
  if (!currentChat) {
    return (
      <div className="col-span-2 flex flex-col h-full border rounded-xl shadow-md bg-white">
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-gray-50 rounded-lg max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">选择一个会话</h3>
            <p className="text-gray-500">从左侧列表中选择一个会话开始聊天</p>
          </div>
        </div>
      </div>
    );
  }
  
  const otherUser = currentChat.otherUser;
  
  // 格式化价格显示
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="col-span-2 flex flex-col h-full border rounded-xl shadow-md overflow-hidden">
      {/* 聊天头部信息 */}
      <div className="p-5 border-b bg-white flex flex-col shadow-sm">
        {/* 用户信息行 */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-gray-100">
              <AvatarImage src={`${API_BASE_URL}${otherUser.avatar}`} className="object-cover"/>
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                {`${otherUser.firstName?.[0]}${otherUser.lastName?.[0]}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-800">{`${otherUser.firstName}${otherUser.lastName}`}</h3>
              <p className="text-xs text-gray-500">最近活跃于 10 分钟前</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <Video className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        {/* 房源信息卡片 */}
        {listing && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 flex items-center gap-3 mt-1 border border-blue-100">
            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
              <img 
                src={`${API_BASE_URL}${listing.image}`} 
                alt={listing.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate text-gray-800">{listing.title}</h4>
              <p className="text-xs text-gray-500 truncate">{listing.description}</p>
              <p className="text-sm font-medium mt-1 text-blue-700">¥{formatPrice(listing.price)}/晚</p>
            </div>
            <Button 
              size="sm" 
              className="flex-shrink-0 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
              onClick={() => window.open(`/listings/${listing.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              查看详情
            </Button>
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
        <div className="space-y-4 py-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderId !== currentUser.id && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                    <AvatarImage src={`${API_BASE_URL}${otherUser.avatar}`} className="object-cover"/>
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xs">
                      {`${otherUser.firstName?.[0]}${otherUser.lastName?.[0]}`}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                    message.senderId === currentUser.id 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none' 
                      : 'bg-white rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.senderId === currentUser.id && (
                  <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                    <AvatarImage src={`${API_BASE_URL}${currentUser.avatar}`} className="object-cover"/>
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                      {`${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">开始与{`${otherUser.firstName}${otherUser.lastName}`}的对话</p>
              <p className="text-gray-500 text-sm mt-1">发送一条消息开始聊天吧！</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 消息输入框 */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <ImageIcon className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="输入消息..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="pr-10 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1 rounded-full hover:bg-gray-100">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <Button 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={!messageInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm disabled:bg-gray-300"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;