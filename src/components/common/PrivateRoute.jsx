import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth();  // 获取当前用户

  // 如果没有用户信息，重定向到登录页
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 如果有用户信息，渲染对应的页面
  return element; 
};
