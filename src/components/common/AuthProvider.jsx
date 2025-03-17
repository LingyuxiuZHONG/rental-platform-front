import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();


// 返回
// {
//   user: 当前用户信息,  // 例如 { username: "张三", email: "zhangsan@example.com" }
//   login: 函数,        // 登录函数
//   logout: 函数        // 退出登录函数
// }
// user:
// {
// "id": 4,
// "firstName": "LINGYUXIU",
// "lastName": "ZHONG",
// "email": "1078807863@qq.com",
// "phoneNumber": null,
// "profileImage": null,
// "description": null,
// "roleType": 1,
// "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDc4ODA3ODYzQHFxLmNvbSIsImlhdCI6MTc0MjE4ODM1OSwiZXhwIjoxNzQyMjc0NzU5fQ.TmcMQqpcEZEyt74tkIv74pIXZn2CwM78kEw8OScDUaQUv_7d0lNphyBxctjxZ2sloySh2jpGxSgIprfItnwsAw"
// }
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("解析用户信息失败:", error);
      return null;
    }
  });

  const setCurrentUser = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo)); 
    console.log(user);
  };
  
  const clearCurrentUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  

  return (
    <AuthContext.Provider value={{ user, setCurrentUser , clearCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
