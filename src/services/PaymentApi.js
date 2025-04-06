import axios from 'axios';


const API_BASE_URL = '/api/payments';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const fetchPayment = async (bookingId) => {
  try {
    const response = await apiClient.get(`/${bookingId}`);
    return response.data.data;
  } catch (error) {
    console.error('查询支付信息失败:', error);
    throw error;
  }
};



export const createPayment = async (data) => {
  try {
    const response = await apiClient.post('',data);
    return response.data.data;
  } catch (error) {
    console.error('查询支付信息失败:', error);
    throw error;
  }
};


