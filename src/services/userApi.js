import axios from 'axios';

const API_BASE_URL = '/api/users';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用户登录
export const userLogin = async (loginParam) => {
  try {
    const response = await apiClient.post('/login', loginParam);
    return response.data.data; // 返回登录成功后的数据

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// 用户注册
export const userRegister = async (userData) => {
  try {
    const response = await apiClient.post('/register', userData);
    return response.data.data; // 返回注册成功后的数据

  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (id, formData) => {
  try {
    const response = await apiClient.put(`/${id}`,formData);
    console.log(response);

    if (response.data.code !== 200) {
      throw new Error('更新失败'); // 如果响应不成功，抛出错误
    }

  } catch (error) {
    console.error('更新用户资料时出错:', error);
    throw error; // 抛出错误，方便后续处理
  }
};

export const verifyPassword = async (id, password) => {
  try{
    const response = await apiClient.post(`/${id}/verify-password`, { password });

    if(response.data.code !== 200){
      throw new Error('验证密码时错误');
    }

  } catch (error){
    console.error('验证用户密码时出错:', error);
    throw error; // 抛出错误，方便后续处理
  }
}

export const updatePassword = async (id, oldPassword, password) => {
  try{
    const response = await apiClient.put(`/${id}/password`, {oldPassword, password });

    if(response.data.code !== 200){
      throw new Error('更新失败');
    }

  } catch (error){
    console.error('更新用户密码时出错:', error);
    throw error; // 抛出错误，方便后续处理
  }
}


export const passwordReset = async (resetData) => {
  try {
    // 调用 API，确保传递正确的格式
    const response = await apiClient.post('/resetPassword', resetData);
    console.log('密码重置成功:', response);
  } catch (error) {
    console.error('更新用户密码时出错:', error);
    setResetError('密码重置失败，请稍后再试。');
  }
};


export const fetchOtherUser = async (id) => {
  try{
    const response = await apiClient.get(`/otherUser/${id}`);

    if(response.data.code !== 200){
      throw new Error('更新失败');
    }

    return response.data.data;

  } catch (error){
    console.error('更新用户密码时出错:', error);
    throw error; // 抛出错误，方便后续处理
  }
}





