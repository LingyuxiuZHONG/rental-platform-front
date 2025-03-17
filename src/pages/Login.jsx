import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { userLogin } from '@/services/userApi';
import { useAuth } from '@/components/common/AuthProvider';
import { ROLE_TYPE } from '@/components/common/Constants';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 验证
    if (!formData.email || !formData.password) {
      setError('请填写邮箱和密码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await userLogin({
        email: formData.email,
        password: formData.password
      });
      
      console.log('登录成功:', response);
      setCurrentUser(response); 
      
      // 根据用户类型导航到不同页面
      const roleType = response.roleType;
      if (roleType === ROLE_TYPE.HOST) {
        navigate('/host/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('登录失败:', error);
      setError('邮箱或密码不正确，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">登录账户</CardTitle>
          <CardDescription className="text-center">
            输入您的邮箱和密码登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密码</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    忘记密码?
                  </Link>
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked }))}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal">
                  记住我
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">或者</span>
            </div>
          </div>
          
          <p className="text-center text-sm">
            还没有账户?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              注册新账户
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;