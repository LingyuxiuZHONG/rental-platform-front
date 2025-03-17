import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userRegister } from '@/services/userApi';
import { useAuth } from '@/components/common/AuthProvider';
import { ROLE_TYPE } from '@/components/common/Constants';


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleType: ROLE_TYPE.GUEST, // 默认为房客
    agreeTerms: false
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

  const handleRoleTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      roleType: value
    }));
  };

  const { setCurrentUser } = useAuth(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.roleType) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不匹配');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('您必须同意条款和条件');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const newUser = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleType: formData.roleType
      };
      const response = await userRegister(newUser);
      console.log('注册成功:', response);

      setCurrentUser(response); 
      
      // 根据用户类型导航到不同的页面
      if (formData.roleType === ROLE_TYPE.HOST) {
        navigate('/host/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('注册失败:', error);
      setError('注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">创建账户</CardTitle>
          <CardDescription className="text-center">
            输入您的信息以创建账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">名字</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    placeholder="三"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">姓氏</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    placeholder="张"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
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
                <Label htmlFor="password">密码</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>您是？</Label>
                <RadioGroup
                  value={formData.roleType}
                  onValueChange={handleRoleTypeChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ROLE_TYPE.GUEST} id="guest" />
                    <Label htmlFor="guest" className="cursor-pointer">我是房客</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ROLE_TYPE.HOST} id="host" />
                    <Label htmlFor="host" className="cursor-pointer">我是房东</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreeTerms" 
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeTerms: checked }))}
                  required
                />
                <Label htmlFor="agreeTerms" className="text-sm font-normal">
                  我同意{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">服务条款</Link>
                  {' '}和{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">隐私政策</Link>
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '创建账户中...' : '创建账户'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm mt-2">
            已有账户?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;