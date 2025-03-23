import axios from 'axios';

const API_BASE_URL = '/api/resources';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});




export const uploadAvatar = async (id, files) => {

    const formData = new FormData();

    // 将文件添加到 FormData 中
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);  
    }

    formData.append('type', 'avatar'); 
    formData.append('id', id);      
    
    try {
      const response = await apiClient.post( "", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data; // 返回后端返回的数据，比如新的头像 URL
  
    } catch (error) {
      console.error('Avatar upload error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };