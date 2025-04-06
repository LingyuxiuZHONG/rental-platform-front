import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/commonComponents/AuthProvider";
import ChatList from "@/components/messageComponents/ChatList";
import ChatWindow from "@/components/messageComponents/ChatWindow";
import { fetchChats } from "@/services/ChatApi";
import { createMessages, fetchMessages } from "@/services/MessageApi";
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
    // 只有当连接成功且有当前聊天时才订阅
    if (!stompClient || !connected || !currentChat) return;
    
    // 取消之前的订阅
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    // 创建新的订阅
    console.log(`订阅聊天室: ${currentChat.id}`);
    subscriptionRef.current = stompClient.subscribe(
      `/topic/chat/${currentChat.id}`, 
      (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          console.log("收到新消息:", receivedMessage);
          
          // 更新消息列表，避免重复消息
          setMessages(prevMessages => {
            // 检查是否已存在该消息（通过ID）
            const messageExists = prevMessages.some(msg => 
              msg.id === receivedMessage.id
            );
            
            if (messageExists) {
              // 更新已存在的消息
              return prevMessages.map(msg => 
                (msg.id === receivedMessage.id) ? 
                  { ...receivedMessage, status: 'delivered' } : msg
              );
            } else {
              // 添加新消息
              return [...prevMessages, {...receivedMessage, status: 'received'}];
            }
          });
        } catch (error) {
          console.error("解析消息失败:", error);
        }
      }
    );
    
    // 组件卸载时清理订阅
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [stompClient, connected, currentChat]);

  // 获取聊天列表
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const response = await fetchChats(user.id, user.roleType);
        setChats(response);

        // 处理 URL 参数中的 chatId
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

  // 获取聊天消息 & 房源信息 (移除了WebSocket相关代码，已在上面单独处理)
  useEffect(() => {
    if (!currentChat) return;

    const loadMessagesAndListing = async () => {
      try {
        const messages = await fetchMessages(currentChat.id);
        setMessages(messages);

        const listing = await fetchListingSummary(currentChat.listingId);
        setListing(listing);
      } catch (error) {
        console.error("获取聊天消息或房源信息失败:", error);
      }
    };

    loadMessagesAndListing();
  }, [currentChat]);

  // 选择聊天
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
      createdAt: new Date().toISOString()
    };
  
    // 乐观更新 UI - 添加状态标记
    const tempMessage = { 
      ...newMessage, 
      status: 'sending' 
    };
    
    setMessages(prevMessages => [...prevMessages, tempMessage]);
  
    try {
      // 通过 WebSocket 发送消息
      stompClient.send("/app/chat/send", {}, JSON.stringify(newMessage));
      
      // 设置超时检查，确保消息被确认
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.status === 'sending' 
              ? { ...msg, status: 'failed' } 
              : msg
          )
        );
      }, 5000); // 5秒超时
    } catch (error) {
      // 处理发送失败情况
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.status === 'sending' ? { ...msg, status: 'failed' } : msg
        )
      );
      console.error("发送消息失败:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">消息</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
        {/* 聊天列表组件 */}
        <ChatList chats={chats} currentChatId={currentChat?.id} onSelectChat={handleSelectChat} />

        {/* 聊天窗口组件 */}
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
