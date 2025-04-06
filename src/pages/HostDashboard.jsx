import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { BarChart, DollarSign, Home, User, MessageSquare, Image } from 'lucide-react';
import axios from 'axios'; // 需要添加axios依赖
import ListingAddModal from '../components/HostComponents/ListingAddModal';
import Overview from '../components/HostComponents/Overview';
import ListingManagement from '../components/HostComponents/ListingManagement';
import BookingManagement from '../components/HostComponents/BookingManagement';
import MessageCenter from '../components/HostComponents/MessageCenter';
import { fetchListingsByHostId } from '@/services/HostListingApi';
import { useAuth } from '@/components/commonComponents/AuthProvider';

const HostDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState(new Date());
  const [addListingOpen, setAddListingOpen] = useState(false);
  const { user } = useAuth();
  

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const messages = [
    { id: 1, from: '张先生', listing: '海景公寓', content: '空调需要维修', date: '2025-03-20', read: false },
    { id: 2, from: '李女士', listing: '市中心豪华套房', content: '想延长租期', date: '2025-03-19', read: true },
    { id: 3, from: '王先生', listing: '商务公寓', content: '热水器不工作', date: '2025-03-18', read: false },
  ];

  // 在组件挂载时获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取房源数据
        const listingsResponse = await fetchListingsByHostId(user.id);
        setListings(listingsResponse);

      
        
        setLoading(false);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('获取数据失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 计算总收入和入住率
  const totalIncome = listings.reduce((sum, listing) => sum + (listing.income || 0), 0);
  const occupancyRate = listings.length > 0 ? 
    (listings.filter(p => p.status === '已租').length / listings.length) * 100 : 0;

  const handleAddListing = async (listingData) => {
    try {

      // 添加返回的新房源到房源列表（后端可能会添加id等字段）
      setListings([...listings, listingData]);
      
      // 关闭模态框
      setAddListingOpen(false);
      
      // 跳转到房源标签页
      setActiveTab('listingManagement');
    } catch (err) {
      console.error('添加房源失败:', err);
      // 这里可以添加错误处理，例如显示错误消息
    }
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中，请稍候...</p>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">房东管理面板</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddListingOpen(true)}>添加新房源</Button>
      </div>
      
      {/* 使用独立的添加房源模态框组件 */}
      <ListingAddModal
        open={addListingOpen}
        onOpenChange={setAddListingOpen}
        onAddListing={handleAddListing}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="listingManagement">房源管理</TabsTrigger>
          {/* <TabsTrigger value="bookingManagement">预订管理</TabsTrigger> */}
          <TabsTrigger value="messageCenter">消息通知</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Overview listings={listings} messages={messages}/>
        </TabsContent>
        
        <TabsContent value="listingManagement" className="space-y-6">
          <ListingManagement listings={listings} setListings={setListings}/>
        </TabsContent>
        
        {/* <TabsContent value="bookingManagement" className="space-y-6">
          <BookingManagement />
        </TabsContent> */}
        
        <TabsContent value="messageCenter" className="space-y-6">
          <MessageCenter messages={messages}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HostDashboard;