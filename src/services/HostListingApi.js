import axios from 'axios';


const API_BASE_URL = '/api/listings';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchListingType = async () => {
  try {
    const response = await apiClient.get(`/listingTypes`);
    return response.data.data;
  } catch (error) {
    console.error('获取房源类型失败:', error);
    throw error;
  }
};

export const createListing = async (listingParams) => {
  try {
    const response = await apiClient.post('', listingParams);
    return response.data.data;
  } catch (error) {
    console.error('搜索房源失败:', error);
    throw error;
  }
};


export const fetchListingsByHostId = async (id) => {
  try {
    const response = await apiClient.get(`/landlord/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('获取房源失败:', error);
    throw error;
  }
};

