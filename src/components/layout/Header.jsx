import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, Menu, UserCircle, Heart, Calendar as CalendarIcon, MessageSquare, LogOut, Moon, Sun } from "lucide-react";
import SearchBar from "./search/SearchBar";
import { useAuth } from '../common/AuthProvider';
import { API_BASE_URL } from '../common/constants';



const Header = ({ theme, toggleTheme}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {user, clearCurrentUser} = useAuth();

  const isLoggedIn = Boolean(user);
  
  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  }


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
    if(location.pathname === '/search'){
      window.location.href = `/search?${queryString}`;
    }else{
      navigate(`/search?${queryString}`);
    }
  };

  const handleClick = (e) => {
    e.preventDefault(); // 阻止默认的 Link 行为
    window.location.href = '/'; // 完全刷新页面
  };

  const handleMenuItemClick = () => {
    setIsOpen(false); // 点击菜单项后关闭菜单
  };



  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a
            href="/" 
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
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full flex items-center gap-2 border px-3 py-2">
                    <Menu className="h-4 w-4" />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`${API_BASE_URL}${user.avatar}`}/>
                      <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleMenuItemClick}>
                      <Link to="/profile" className="flex items-center w-full">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>个人信息</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleMenuItemClick}>
                      <Link to="/favorites" className="flex items-center w-full">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>我的收藏</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleMenuItemClick}>
                      <Link to="/trips" className="flex items-center w-full">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>我的行程</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" >
                      <Link to="/messages" className="flex items-center w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>消息</span>
                      </Link>
                    </Button>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                    <Link to="/login" className="flex items-center w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>退出登录</span>
                    </Link>
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Link to="/login">登录</Link>
                </Button>
                <Button>
                  <Link to="/register">注册</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
