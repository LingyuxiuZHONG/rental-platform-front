import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share, MapPin, Star, Users, Home, Wifi, Car, Utensils, Calendar as CalendarIcon } from 'lucide-react';

// 模拟房源详情数据
const mockListing = {
  id: 1,
  title: '现代海景公寓',
  description: '这是一间位于上海市中心的现代化公寓，拥有壮观的海景视野。公寓内配备全新的家具和电器，24小时保安服务。步行10分钟可达地铁站，周边有多家餐厅和购物中心。',
  location: '上海市浦东新区陆家嘴',
  price: 688,
  rating: 4.8,
  reviews: 126,
  host: {
    name: '李明',
    avatar: '/api/placeholder/50/50',
    joined: '2020年',
    responseRate: 98
  },
  amenities: ['WiFi', '停车位', '游泳池', '健身房', '厨房', '洗衣机', '空调', '电视'],
  images: [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ],
  bedrooms: 2,
  bathrooms: 1,
  maxGuests: 4,
  cleaningFee: 100,
  serviceFee: 50
};

// 模拟评论数据
const mockReviews = [
  {
    id: 1,
    user: { name: '王小明', avatar: '/api/placeholder/40/40' },
    rating: 5,
    date: '2023年10月',
    comment: '环境非常好，视野开阔，设施齐全。房东很热情，回复及时。'
  },
  {
    id: 2,
    user: { name: '张丽', avatar: '/api/placeholder/40/40' },
    rating: 4,
    date: '2023年9月',
    comment: '位置很好，交通便利，周边配套设施完善。房间整洁，但空调有点吵。'
  },
  {
    id: 3,
    user: { name: '陈强', avatar: '/api/placeholder/40/40' },
    rating: 5,
    date: '2023年8月',
    comment: '非常满意的一次住宿体验，房间宽敞明亮，视野好，设施齐全。房东很贴心，推荐了很多附近的好去处。'
  }
];

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState({
    from: undefined,
    to: undefined
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  // 模拟数据加载
  useEffect(() => {
    // 实际应用中应该从API获取数据
    console.log(`加载房源ID: ${id}`);
    
    // 计算总价
    if (selectedDates.from && selectedDates.to) {
      const nightCount = Math.ceil(
        (selectedDates.to - selectedDates.from) / (1000 * 60 * 60 * 24)
      );
      setNights(nightCount);
      setTotalPrice(mockListing.price * nightCount + mockListing.cleaningFee + mockListing.serviceFee);
    }
  }, [id, selectedDates]);

  const handleDateSelect = (range) => {
    setSelectedDates(range);
  };

  const handleBooking = () => {
    if (selectedDates.from && selectedDates.to) {
      navigate(`/booking/${id}`, {
        state: {
          listing: mockListing,
          dates: selectedDates,
          nights,
          totalPrice
        }
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-4">{mockListing.title}</h1>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="font-medium">{mockListing.rating}</span>
          <span className="mx-1">·</span>
          <span className="text-muted-foreground">{mockListing.reviews} 条评价</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{mockListing.location}</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            分享
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            收藏
          </Button>
        </div>
      </div>
      
      {/* 房源图片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <div className="md:col-span-2 md:row-span-2">
          <img 
            src={mockListing.images[0]} 
            alt="主图" 
            className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
          />
        </div>
        <div>
          <img src={mockListing.images[1]} alt="图片2" className="w-full h-full object-cover" />
        </div>
        <div>
          <img src={mockListing.images[2]} alt="图片3" className="w-full h-full object-cover rounded-tr-lg" />
        </div>
        <div>
          <img src={mockListing.images[3]} alt="图片4" className="w-full h-full object-cover" />
        </div>
        <div>
          <img src={mockListing.images[4]} alt="图片5" className="w-full h-full object-cover rounded-br-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 房源信息 */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  由 {mockListing.host.name} 出租的整套公寓
                </h2>
                <p className="text-muted-foreground">
                  {mockListing.maxGuests} 位客人 · {mockListing.bedrooms} 间卧室 · {mockListing.bathrooms} 间卫生间
                </p>
              </div>
              <Avatar>
                <AvatarImage src={mockListing.host.avatar} alt={mockListing.host.name} />
                <AvatarFallback>{mockListing.host.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* 房源描述 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">房源描述</h2>
            <p>{mockListing.description}</p>
          </div>
          
          {/* 设施 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">设施</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockListing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  {amenity === 'WiFi' && <Wifi className="w-5 h-5 mr-2" />}
                  {amenity === '停车位' && <Car className="w-5 h-5 mr-2" />}
                  {amenity === '厨房' && <Utensils className="w-5 h-5 mr-2" />}
                  {!['WiFi', '停车位', '厨房'].includes(amenity) && <Home className="w-5 h-5 mr-2" />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 评价 */}
          <div>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-500 mr-1" />
              <span className="font-medium text-lg">{mockListing.rating}</span>
              <span className="mx-1">·</span>
              <span className="text-lg">{mockListing.reviews} 条评价</span>
            </div>
            
            <div className="space-y-6">
              {mockReviews.map(review => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <Avatar className="w-10 h-10 mr-2">
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
              
              <Button variant="outline" className="mt-4">查看全部 {mockListing.reviews} 条评价</Button>
            </div>
          </div>
        </div>
        
        {/* 预订卡片 */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-bold">¥{mockListing.price} <span className="text-sm font-normal">/ 晚</span></p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{mockListing.rating}</span>
                  <span className="mx-1 text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{mockListing.reviews} 条评价</span>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden mb-4">
                <Tabs defaultValue="dates">
                  <TabsList className="grid grid-cols-2 w-full border-b">
                    <TabsTrigger value="dates">日期</TabsTrigger>
                    <TabsTrigger value="guests">房客</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dates" className="p-4">
                    <div className="text-center mb-2">选择入住和退房日期</div>
                    <Calendar
                      mode="range"
                      selected={selectedDates}
                      onSelect={handleDateSelect}
                      className="border-0"
                    />
                  </TabsContent>
                  <TabsContent value="guests" className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">成人</p>
                        <p className="text-sm text-muted-foreground">13岁及以上</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">-</Button>
                        <span>2</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">+</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="font-medium">儿童</p>
                        <p className="text-sm text-muted-foreground">2-12岁</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">-</Button>
                        <span>0</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">+</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button 
                className="w-full mb-4"
                disabled={!selectedDates.from || !selectedDates.to}
                onClick={handleBooking}
              >
                预订
              </Button>
              
              {selectedDates.from && selectedDates.to && (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">预订前无需付款</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>¥{mockListing.price} x {nights}晚</span>
                      <span>¥{mockListing.price * nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>清洁费</span>
                      <span>¥{mockListing.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>服务费</span>
                      <span>¥{mockListing.serviceFee}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>总价</span>
                      <span>¥{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;