import axios from 'axios';


const API_BASE_URL = '/api/bookings';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBookings = async (userId) => {
  try {
    const response = await apiClient.get(`/bookingUser/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('获取预订失败:', error);
    throw error;
  }
};

export const createBooking = async (data) => {
  try {
    const response = await apiClient.post('', data);
    return response.data;
  } catch (error) {
    console.error('创建预订失败:', error);
    // Return an error object that matches your expected format
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || '创建预订失败，请重试',
      data: null

    };
  }
};

export const createGuest = async (data) => {
  try {
    const response = await apiClient.post('/guests', data);

  } catch (error) {
    console.error('添加入住人失败:', error);
    throw error;
  }
};



export const cancelBooking = async (bookingId, params) => {
  try {
    const response = await apiClient.post(`/${bookingId}/cancel`,params);
    return response.data.data;
  } catch (error) {
    console.error('取消预订失败:', error);
    throw error;
  }
};

