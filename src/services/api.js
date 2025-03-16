// src/services/api.js
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 处理401错误 - 认证失效
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



// 用户相关服务
export const userService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
};

// 房源相关服务
export const listingService = {
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  getFeaturedListings: () => api.get('/listings/featured'),
  searchListings: (searchParams) => api.get('/listings/search', { params: searchParams }),
  createListing: (listingData) => api.post('/listings', listingData),
  updateListing: (id, listingData) => api.put(`/listings/${id}`, listingData),
  deleteListing: (id) => api.delete(`/listings/${id}`),
  getListingsFilteredByLocaltion: (location) => api.get('/listings/filter',{})
};

// 预订相关服务
export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/me'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

// 支付相关服务
export const paymentService = {
  createPayment: (paymentData) => api.post('/payments', paymentData),
  getPaymentStatus: (id) => api.get(`/payments/${id}`),
};

// 评价相关服务
export const reviewService = {
  getListingReviews: (listingId) => api.get(`/reviews/listing/${listingId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getUserReviews: () => api.get('/reviews/me'),
};

// 收藏相关服务
export const favoriteService = {
  addToFavorites: (listingId) => api.post('/favorites', { listingId }),
  removeFromFavorites: (listingId) => api.delete(`/favorites/${listingId}`),
  getUserFavorites: () => api.get('/favorites'),
};

export default api;