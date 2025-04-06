import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/commonComponents/AuthProvider";
import ChatList from "@/components/messageComponents/ChatList";
import ChatWindow from "@/components/messageComponents/ChatWindow";
import { fetchChats } from "@/services/ChatApi";
import { createMessages, fetchMessages, updateMessagesStatus } from "@/services/MessageApi";
import { fetchListingSummary } from "@/services/ListingApi";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [listing, setListing] = useState(null);
  const chatId = searchParams.get("chatId");

  // WebSocket 相关
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const subscriptionRef = useRef(null);

  // 连接 WebSocket
  useEffect(() => {
    let stomp = null;
    
    const connectSocket = () => {
      const socket = new SockJS("http://localhost:5173/ws");
      stomp = over(socket);
      
      // 避免过多的控制台日志
      stomp.debug = null;
      
      stomp.connect(
        {}, 
        () => {
          console.log("WebSocket连接成功");
          setStompClient(stomp);
          setConnected(true);
        },
        (error) => {
          console.error("WebSocket连接失败:", error);
          // 连接失败后重试
          setTimeout(connectSocket, 5000);
        }
      );
    };
    
    connectSocket();

    // 清理函数
    return () => {
      if (stomp && stomp.connected) {
        stomp.disconnect();
        console.log("WebSocket断开连接");
      }
    };
  }, []);

  // 处理WebSocket订阅
  useEffect(() => {
    if (!stompClient || !connected || !currentChat) return;
    
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    console.log(`订阅聊天室: ${currentChat.id}`);
    subscriptionRef.current = stompClient.subscribe(
      `/topic/chat/${currentChat.id}`, 
      (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          console.log("收到新消息:", receivedMessage);
          
          // 如果是自己发送的消息，不处理
          if(receivedMessage.senderId === user.id){
            return;
          }
          
          // 将新消息添加到列表中
          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => 
              msg.id === receivedMessage.id
            );
            if (messageExists) {
              return prevMessages.map(msg => 
                (msg.id === receivedMessage.id) ? 
                  { ...receivedMessage } : msg
              );
            } else {
              return [...prevMessages, { ...receivedMessage, status: 0 }];
            }
          });
          
          // 更新聊天列表中的未读消息数量
          updateChatUnreadCount(currentChat.id, true);
        } catch (error) {
          console.error("解析消息失败:", error);
        }
      }
    );
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [stompClient, connected, currentChat, user]);

  // 更新聊天的未读消息数量
  const updateChatUnreadCount = (chatId, increment = false) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadCount: increment ? (chat.unreadCount || 0) + 1 : 0
          };
        }
        return chat;
      })
    );
  };

  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const response = await fetchChats(user.id, user.roleType);
        setChats(response);

        const selectedChat = chatId
          ? response.find((chat) => chat.id === Number(chatId))
          : response[0];

        if (selectedChat) {
          setCurrentChat(selectedChat);
          navigate(`/messages?chatId=${selectedChat.id}`, { replace: true });
        }
      } catch (error) {
        console.error("获取聊天列表失败:", error);
      }
    };

    loadChats();
  }, [user, chatId, navigate]);

  useEffect(() => {
    if (!currentChat) return;

    const loadMessagesAndListing = async () => {
      try {
        const messages = await fetchMessages(currentChat.id);
        setMessages(messages);

        const listing = await fetchListingSummary(currentChat.listingId);
        setListing(listing);
        
        // 将当前聊天的所有未读消息标记为已读
        markMessagesAsRead(currentChat.id);
      } catch (error) {
        console.error("获取聊天消息或房源信息失败:", error);
      }
    };

    loadMessagesAndListing();
  }, [currentChat]);

  // 将消息标记为已读
  const markMessagesAsRead = async (chatId) => {
    // 找到当前聊天中所有未读且非当前用户发送的消息
    const unreadMessages = messages.filter(
      msg => msg.status === 0 && msg.senderId !== user.id
    );
    
    if (unreadMessages.length === 0) return;
    
    try {
      // 更新本地消息状态
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          (msg.status === 0 && msg.senderId !== user.id) ? 
            { ...msg, status: 1 } : msg
        )
      );
      
      // 重置未读消息计数
      updateChatUnreadCount(chatId, false);
      
      // 调用API更新服务器上的消息状态
      const messageIds = unreadMessages.map(msg => msg.id);
      await updateMessagesStatus(messageIds, 1);
      
      // 通知其他客户端消息已读
      if (stompClient && connected) {
        messageIds.forEach(id => {
          stompClient.send("/app/chat/status", {}, JSON.stringify({
            messageId: id,
            status: 1
          }));
        });
      }
    } catch (error) {
      console.error("更新消息状态失败:", error);
    }
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    navigate(`/messages?chatId=${chat.id}`, { replace: true });
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !currentChat || !stompClient || !connected) return;
  
    const newMessage = {
      chatId: currentChat.id,
      senderId: user.id,
      content: content,
      messageType: 1,
      status: 0, // 初始状态为未读
      createdAt: new Date().toISOString()
    };
  
    setMessages(prevMessages => [...prevMessages, newMessage]);
  
    try {
      stompClient.send("/app/chat/send", {}, JSON.stringify(newMessage));
      
      // 更新当前聊天的最后消息
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              lastMessage: content,
              lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error("发送消息失败:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">消息</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
        <ChatList chats={chats} currentChatId={currentChat?.id} onSelectChat={handleSelectChat} />
        <ChatWindow
          currentChat={currentChat}
          messages={messages}
          currentUser={user}
          onSendMessage={handleSendMessage}
          listing={listing}
          connectionStatus={connected ? "已连接" : "连接中..."}
        />
      </div>
    </div>
  );
};

export default Messages;