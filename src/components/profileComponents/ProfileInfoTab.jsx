import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateUserProfile } from '@/services/UserApi';
import { uploadAvatar } from '@/services/ResourceApi';
import { API_BASE_URL } from '../commonComponents/Constants';

const ProfileInfoTab = ({ user, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    description: user?.description || "",
  });

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
    const files = e.target.files;

    if (!files) return;
  
    try {
      const response = await uploadAvatar(user.id, files);

      setCurrentUser((prevUser) => ({
        ...prevUser,
        avatar: `${response[0]}?t=${Date.now()}`,
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

  return (
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
  );
};

export default ProfileInfoTab;