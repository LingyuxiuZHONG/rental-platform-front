import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/components/commonComponents/AuthProvider';
 

// 导入拆分的组件
import ProfileInfoTab from '@/components/profileComponents/ProfileInfoTab';
import ProfileSecurityTab from '@/components/profileComponents/ProfileSecurityTab';
import ProfilePreferencesTab from '@/components/profileComponents/ProfilePreferencesTab';


const Profile = () => {
  const navigate = useNavigate();
  const { user, setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("info"); // 当前选中的标签，默认是 "info"

  // 如果用户未登录则重定向
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
          <ProfileInfoTab user={user} setCurrentUser={setCurrentUser} />
        </TabsContent>

        <TabsContent value="security">
          <ProfileSecurityTab onPasswordChangeSuccess={handlePasswordChangeSuccess} />
        </TabsContent>

        <TabsContent value="preferences">
          <ProfilePreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;