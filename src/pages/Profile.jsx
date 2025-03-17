import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from '@/components/common/AuthProvider';
import { uploadAvatar, updateUserProfile } from '@/services/userApi';
import { API_BASE_URL } from '@/components/common/constants';

import PasswordChangeForm from './Profile/ PasswordChangeForm';


const Profile = () => {
  const navigate = useNavigate();
  const { user, setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("info"); // 当前选中的标签，默认是 "info"


  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    description: user?.description || "",
  });

  // 如果用户未登录则重定向
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      await updateUserProfile(user.id, formData);
      
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        description: formData.description
      };
      
      setCurrentUser(updatedUser);
      setIsEditing(false);
      toast("个人资料已更新：您的个人信息已成功更新。");
    } catch (error) {
      console.error("更新资料失败:", error);
      toast.error("更新失败。请重试。");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // 创建一个本地 URL 来显示预览
    const newAvatarUrl = URL.createObjectURL(file);
    setCurrentUser((prevUser) => ({
      ...prevUser,
      avatar: newAvatarUrl, // 临时更新头像预览
    }));
  
    try {
      const response = await uploadAvatar(user.id, file);

      setCurrentUser((prevUser) => ({
        ...prevUser,
        avatar: data, // 假设后端返回新的头像 URL
      }));
      
    } catch (error) {
      console.error('头像上传失败', error);
      alert('头像上传失败');
      // 恢复原头像
      setCurrentUser((prevUser) => ({
        ...prevUser,
        avatar: prevUser.avatar,
      }));
    }
  };

  // 如果用户未登录，不渲染个人资料
  if (!user) {
    return null;
  }

  
  const handlePasswordChangeSuccess = () => {
    // 密码修改成功后，切换到 "个人信息" 标签
    setActiveTab("info");
  };


  return (
    <div className="container mx-auto py-6 max-w-4xl">
      
      <h1 className="text-3xl font-bold mb-6">我的个人资料</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">个人信息</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="preferences">偏好设置</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>个人信息</CardTitle>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  编辑资料
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                      <AvatarImage src={`${API_BASE_URL}${user.avatar}`} className="object-cover"/>
                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div>
                      <input 
                        type="file" 
                        id="avatar" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleImageChange} 
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => document.getElementById('avatar').click()}
                      >
                        更改照片
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">名字</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">姓氏</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">电子邮箱</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">电话号码</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">个人简介</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            firstName: user.firstName || "",
                            lastName: user.lastName || "",
                            email: user.email || "",
                            phoneNumber: user.phoneNumber || "",
                            description: user.description || ""
                          });
                        }}
                      >
                        取消
                      </Button>
                      <Button type="submit">保存更改</Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">姓名</p>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">电子邮箱</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">电话号码</p>
                        <p className="font-medium">{user.phoneNumber || "未提供"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">角色</p>
                        <p className="font-medium">{user.roleType === 1 ? "用户" : "管理员"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">个人简介</p>
                      <p className="font-medium">{user.description || "暂无个人简介"}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">修改密码</h3>
                <PasswordChangeForm onPasswordChangeSuccess={handlePasswordChangeSuccess}/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>偏好设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">通知设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">邮件通知</p>
                      <p className="text-sm text-gray-500">接收预订更新和促销信息</p>
                    </div>
                    <Button variant="outline">已启用</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">短信通知</p>
                      <p className="text-sm text-gray-500">获取关于您预订的提醒</p>
                    </div>
                    <Button variant="outline">已禁用</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">语言和货币</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">语言</Label>
                    <select
                      id="language"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="zh">中文</option>
                      <option value="en">英文</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">货币</Label>
                    <select
                      id="currency"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="cny">人民币 (¥)</option>
                      <option value="usd">美元 ($)</option>
                      <option value="eur">欧元 (€)</option>
                      <option value="gbp">英镑 (£)</option>
                      <option value="jpy">日元 (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;