import axios from 'axios';


const API_BASE_URL = '/api/chats';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createChat = async (params) => {
  try {
    const response = await apiClient.post('', params);
    return response.data.data;
  } catch (error) {
    console.error('创建聊天失败:', error);
    throw error;
  }
};

export const fetchChats = async (userId, roleType) => {
    try {
      const response = await apiClient.get(`/${userId}?roleType=${roleType}`);
      return response.data.data;
    } catch (error) {
      console.error('获取聊天失败:', error);
      throw error;
    }
  };
  