import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { BarChart, DollarSign, Home, User, MessageSquare, Image } from 'lucide-react';
import ListingAddModal from './landlord/ListingAddModal';
import Overview from './landlord/Overview';
import ListingManagement from './landlord/ListingManagement';
import BookingManagement from './landlord/BookingManagement';
import MessageCenter from './landlord/MessageCenter';

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState(new Date());
  const [addListingOpen, setAddListingOpen] = useState(false);
  
  // 模拟数据
  const [listings, setListings] = useState([
    { id: 1, name: '海景公寓', address: '滨海大道123号', status: '已租', income: 8500, tenant: '张先生', endDate: '2025-06-30', type: '公寓', bedrooms: 2, bathrooms: 1, images: [] },
    { id: 2, name: '市中心豪华套房', address: '中央区456号', status: '已租', income: 12000, tenant: '李女士', endDate: '2025-05-15', type: '套房', bedrooms: 3, bathrooms: 2, images: [] },
    { id: 3, name: '花园别墅', address: '绿园小区789号', status: '空置', income: 0, tenant: '-', endDate: '-', type: '别墅', bedrooms: 4, bathrooms: 3, images: [] },
    { id: 4, name: '商务公寓', address: '商务区101号', status: '已租', income: 9800, tenant: '王先生', endDate: '2025-04-20', type: '公寓', bedrooms: 1, bathrooms: 1, images: [] },
  ]);
  
  const messages = [
    { id: 1, from: '张先生', listing: '海景公寓', content: '空调需要维修', date: '2025-03-20', read: false },
    { id: 2, from: '李女士', listing: '市中心豪华套房', content: '想延长租期', date: '2025-03-19', read: true },
    { id: 3, from: '王先生', listing: '商务公寓', content: '热水器不工作', date: '2025-03-18', read: false },
  ];
  
  const totalIncome = listings.reduce((sum, listing) => sum + listing.income, 0);
  const occupancyRate = (listings.filter(p => p.status === '已租').length / listings.length) * 100;
  
  const handleAddListing = (listingData) => {
    // 创建新房源对象
    const newListingObj = {
      title: listingData.title,
      address: listingData.address,
      listingType: listingData.listingType,
      bedrooms: listingData.bedrooms,
      bathrooms: listingData.bathrooms,
      price: listingData.price,
      description: listingData.description,
      maxGuests: listingData.maxGuests,
      longitude: listingData.longitude,
      latitude: listingData.latitude,
      images: listingData.images
    };
    
    // 添加到房源列表
    setListings([...listings, newListingObj]);
    
    // 关闭模态框
    setAddListingOpen(false);
    
    // 跳转到房源标签页
    setActiveTab('listingManagement');
  };
  
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
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="listingManagement">房源管理</TabsTrigger>
          <TabsTrigger value="bookingManagement">预订管理</TabsTrigger>
          <TabsTrigger value="messageCenter">消息通知</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Overview listings={listings} messages={messages}/>
        </TabsContent>
        
        <TabsContent value="listingManagement" className="space-y-6">
          <ListingManagement listings={listings}/>
        </TabsContent>
        
        <TabsContent value="bookingManagement" className="space-y-6">
          <BookingManagement />
        </TabsContent>
        
        <TabsContent value="messageCenter" className="space-y-6">
          <MessageCenter messages={messages}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandlordDashboard;