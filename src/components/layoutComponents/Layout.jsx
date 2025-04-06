import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Heart, Calendar, MessageSquare } from "lucide-react";
import Header from './Header'; // 引入Header组件

const Layout = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  

  return (
    <div className="min-h-screen flex flex-col">
      {/* 使用Header组件，并传入需要的props */}
      <Header theme={theme} toggleTheme={toggleTheme}/>

      {/* 主内容 */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-50 border-t mt-12 pt-8 pb-16 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">支持</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:underline">帮助中心</a></li>
                <li><a href="#" className="text-gray-600 hover:underline">安全信息</a></li>
                <li><a href="#" className="text-gray-600 hover:underline">取消选项</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">社区</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:underline">房东指南</a></li>
                <li><a href="#" className="text-gray-600 hover:underline">论坛</a></li>
                <li><a href="#" className="text-gray-600 hover:underline">邀请好友</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">出租</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:underline">出租房源</a></li>
                <li><a href="#" className="text-gray-600 hover:underline">资源中心</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">关于</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:underline">公司信息</a></li>
                <li><a href="#" className="text-gray-600 hover:underline">职业机会</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© 2025 Dinofly, Inc. 保留所有权利</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">隐私政策</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">条款</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">网站地图</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;