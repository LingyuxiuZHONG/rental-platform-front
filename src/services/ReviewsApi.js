import axios from 'axios';


const API_BASE_URL = '/api/reviews';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// 获取单个房源详情
export const fetchListingReviews = async (listingId) => {
  try {
    const response = await apiClient.get(`/listings/${listingId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};
