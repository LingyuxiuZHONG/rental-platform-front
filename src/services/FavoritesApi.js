import axios from 'axios';


const API_BASE_URL = '/api/users';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export const updateFavorite = async (userId, listingId, favoriteStatus) => {
  try {
    const response = await apiClient.put(`/favorites`, {
      userId: userId,
      listingId: listingId,
      isFavorite: favoriteStatus
    });

  } catch (error) {
    console.error('更新收藏状态失败:', error);
    throw error;
  }
};


export const fetchFavorites = async (userId) => {
  try {
    const response = await apiClient.get(`/${userId}/favorites`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const removeFavorite = async (userId, favoriteId) => {
    try {
      const response = await apiClient.delete(`/${userId}/favorites/${favoriteId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  };

