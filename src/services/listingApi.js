import axios from 'axios';


const API_BASE_URL = '/api/listings';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// 添加请求拦截器
// apiClient.interceptors.request.use(
//   (config) => {
//     // 从localStorage获取token（如果你有身份验证）
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 搜索房源的API函数
export const searchListings = async (searchParams) => {
  try {
    const response = await apiClient.post('/search', searchParams);
    return response.data.data;
  } catch (error) {
    console.error('搜索房源失败:', error);
    throw error;
  }
};


// 获取单个房源详情
export const fetchListing = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};

// 检查房源在特定日期范围内的可用性
export const checkAvailability = async (listingId, dateRange) => {
  try {
    const params = new URLSearchParams();
    
    if (dateRange.from) {
      params.append('checkIn', dateRange.from.toISOString().split('T')[0]);
    }
    
    if (dateRange.to) {
      params.append('checkOut', dateRange.to.toISOString().split('T')[0]);
    }
    
    const response = await apiClient.get(`/${listingId}/availability?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

// 获取推荐房源
export const getRecommendedListings = async (limit = 8) => {
  try {
    const response = await apiClient.get(`/recommended?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended listings:', error);
    throw error;
  }
};

// 根据过滤条件获取房源
export const getFilteredListings = async (filters) => {
  try {
    // 处理复杂的过滤条件
    const params = new URLSearchParams();
    
    // 添加基本过滤
    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    
    // 添加日期范围
    if (filters.dateRange?.from) {
      params.append('checkIn', filters.dateRange.from.toISOString().split('T')[0]);
    }
    if (filters.dateRange?.to) {
      params.append('checkOut', filters.dateRange.to.toISOString().split('T')[0]);
    }
    
    // 添加客人信息
    if (filters.guests?.adults) params.append('adults', filters.guests.adults.toString());
    if (filters.guests?.children) params.append('children', filters.guests.children.toString());
    if (filters.guests?.infants) params.append('infants', filters.guests.infants.toString());
    
    // 添加设施过滤
    if (filters.amenities && Array.isArray(filters.amenities)) {
      filters.amenities.forEach(amenity => {
        params.append('amenities', amenity);
      });
    }
    
    // 添加排序
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    // 添加分页
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await apiClient.get(`/listings?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered listings:', error);
    throw error;
  }
};

