import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, Menu, UserCircle, Heart, Calendar as CalendarIcon, MessageSquare, LogOut, Moon, Sun } from "lucide-react";
import SearchBar from "./search/SearchBar";

const Header = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  
  // 假设用户已登录
  const isLoggedIn = true;
  const user = {
    name: "张三",
    avatar: "/api/placeholder/40/40",
    initials: "张",
  };

  // 处理搜索
  const handleSearch = (searchParams) => {
    const queryString = new URLSearchParams({
      address: searchParams.address || "",
      from: searchParams.dateRange?.from ? searchParams.dateRange.from.toISOString().split('T')[0] : "",
      to: searchParams.dateRange?.to ? searchParams.dateRange.to.toISOString().split('T')[0] : "",
      adults: searchParams.guests?.adults ?? 1,
      children: searchParams.guests?.children ?? 0,
      infants: searchParams.guests?.infants ?? 0
    }).toString();

    navigate(`/search?${queryString}`);
  };

  const handleClick = (e) => {
    e.preventDefault(); // 阻止默认的 Link 行为
    window.address.href = '/'; // 完全刷新页面
  };

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/" // 使用 <a> 标签而非 <Link> 标签
            className="text-xl font-medium text-primary flex items-center"
            onClick={handleClick}
          >
            <Home className="mr-2" />
            Dinofly
          </a>

          {/* SearchBar with onSearch passed down */}
          <SearchBar onSearch={handleSearch} />

          {/* 右侧用户菜单 */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 hidden md:flex rounded-full" 
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full flex items-center gap-2 border px-3 py-2">
                    <Menu className="h-4 w-4" />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>个人信息</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>我的收藏</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>我的行程</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>消息</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline">登录</Button>
                <Button>注册</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
