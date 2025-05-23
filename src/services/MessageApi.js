import axios from 'axios';


const API_BASE_URL = '/api/messages';


// Authorization: `Bearer ${localStorage.getItem("token")}`,


// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export const fetchMessages = async (chatId) => {
  try {
    const response = await apiClient.get(`${chatId}`);
    return response.data.data;
  } catch (error) {
    console.error('创建聊天失败:', error);
    throw error;
  }
};

export const createMessages = async (params) => {
  try {
    const response = await apiClient.post('',params);

  } catch (error) {
    console.error('创建聊天失败:', error);
    throw error;
  }
};

export const updateMessagesStatus = async (params) => {
  try {
    const response = await apiClient.put('',params);

  } catch (error) {
    console.error('标记消息已读失败:', error);
    throw error;
  }
};

