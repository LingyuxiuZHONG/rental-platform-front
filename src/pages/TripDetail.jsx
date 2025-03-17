import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, MapPin, Users, ChevronLeft, Home, 
  Phone, Mail, MessageCircle, Download, AlertCircle, Star,
  Wifi, Snowflake, Car, Image, CreditCard, Share2
} from "lucide-react";

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trip, settrip] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch trip details
    setTimeout(() => {
      settrip({
        id: parseInt(id),
        title: '现代化市中心公寓',
        location: '上海',
        address: '上海市静安区南京西路1788号',
        image: 'https://example.com/apartment1.jpg',
        images: [
          'https://example.com/apartment1.jpg',
          'https://example.com/apartment1_living.jpg',
          'https://example.com/apartment1_bedroom.jpg',
          'https://example.com/apartment1_kitchen.jpg'
        ],
        checkIn: '2025-04-10',
        checkOut: '2025-04-15',
        status: 'upcoming',
        guests: 2,
        price: 680,
        totalPrice: 3400,
        cleaningFee: 200,
        serviceFee: 120,
        rating: null,
        hostName: '王女士',
        hostImage: 'https://example.com/host1.jpg',
        hostPhone: '+86 138 **** 5678',
        hostEmail: 'host****@example.com',
        description: '这是一套位于上海市中心的精美公寓，步行可到达主要景点和商业区。公寓内设施齐全，拥有现代化的厨房和舒适的卧室。',
        amenities: [
          '无线网络',
          '空调',
          '厨房',
          '洗衣机',
          '电视',
          '熨斗',
          '吹风机',
          '24小时入住'
        ],
        houseRules: [
          '禁止吸烟',
          '不允许携带宠物',
          '不允许举办派对',
          '22:00后请保持安静'
        ],
        checkInInstructions: '到达后请联系房东，我会告诉您如何获取钥匙和进入公寓。请在下午3点后办理入住。',
        paymentInfo: {
          method: '信用卡 (尾号 5678)',
          status: '已支付',
          transactionId: 'TX12345678',
          date: '2025-03-15'
        },
        cancellationPolicy: '入住前7天可全额退款，之后退款50%。入住当天不可退款。'
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  // Format date to display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };



  const handleCancel = () => {
    // 这里应该显示一个确认对话框
    alert('确定要取消预订吗？取消政策可能会导致部分费用不予退还。');
  };

  const calculateDays = () => {
    if (!trip) return 0;
    const checkIn = new Date(trip.checkIn);
    const checkOut = new Date(trip.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <p>正在加载住宿详情...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link to={"/trips"}>
          <Button className="mt-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> 返回行程列表
          </Button>
        </Link>
        
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>未找到住宿信息</AlertDescription>
        </Alert>
        <Link to={"/trips"}>
          <Button className="mt-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> 返回行程列表
          </Button>
        </Link>
        
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Link to={"/trips"}>
            <Button variant="ghost" className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <Badge variant={trip.status === 'upcoming' ? 'default' : 'secondary'} className="ml-3">
            {trip.status === 'upcoming' ? '即将入住' : '已入住'}
          </Badge>
        </div>
        <div className="flex mt-4 md:mt-0">
          <Button variant="outline" className="mr-2" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> 分享
          </Button>
          <Link to={`/messages/${trip.id}`}>
            <Button variant="outline" className="mr-2" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" /> 联系房东
            </Button>
          </Link>
          {trip.status === 'upcoming' && (
            <Link to={`/trips/${id}/modify`}>
              <Button size="sm">
                修改
              </Button>
            </Link>
            
          )}
        </div>
      </div>

      {/* trip Overview */}
      <Card className="mb-8">
        <div className="aspect-video w-full bg-muted relative">
          {/* 这里可以放置一个实际的房源图片 */}
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Home className="h-16 w-16 text-gray-400" />
          </div>
        </div>
        <CardContent className="pt-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">详情</TabsTrigger>
              <TabsTrigger value="payment">支付信息</TabsTrigger>
              <TabsTrigger value="host">房东信息</TabsTrigger>
              <TabsTrigger value="rules">入住规则</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">入住信息</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">入住日期</p>
                        <p className="text-muted-foreground">{formatDate(trip.checkIn)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">退房日期</p>
                        <p className="text-muted-foreground">{formatDate(trip.checkOut)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">地址</p>
                        <p className="text-muted-foreground">{trip.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">房客</p>
                        <p className="text-muted-foreground">{trip.guests} 位房客</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">房源介绍</h2>
                  <p className="text-muted-foreground mb-4">{trip.description}</p>
                  
                  <h3 className="font-medium mt-4 mb-2">设施和服务</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {trip.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        {amenity.includes('无线') ? <Wifi className="h-4 w-4 mr-2" /> : 
                         amenity.includes('空调') ? <Snowflake className="h-4 w-4 mr-2" /> : 
                         amenity.includes('停车') ? <Car className="h-4 w-4 mr-2" /> : 
                         <Star className="h-4 w-4 mr-2" />}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">入住说明</h3>
                <p className="text-muted-foreground">{trip.checkInInstructions}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="payment">
              <h2 className="text-xl font-semibold mb-4">支付详情</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>￥{trip.price} x {calculateDays()} 晚</span>
                      <span>￥{trip.price * calculateDays()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>清洁费</span>
                      <span>￥{trip.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>服务费</span>
                      <span>￥{trip.serviceFee}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-medium">
                      <span>总计</span>
                      <span>￥{trip.totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">支付方式</h3>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{trip.paymentInfo.method}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  交易日期: {new Date(trip.paymentInfo.date).toLocaleDateString('zh-CN')}
                </p>
                <p className="text-sm text-muted-foreground">
                  交易编号: {trip.paymentInfo.transactionId}
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">取消政策</h3>
                <p className="text-muted-foreground">{trip.cancellationPolicy}</p>
                {trip.status === 'upcoming' && (
                  <Button variant="destructive" className="mt-4" onClick={handleCancel}>
                    取消预订
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="host">
              <h2 className="text-xl font-semibold mb-4">房东信息</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center overflow-hidden">
                  {/* 这里可以放房东头像 */}
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">{trip.hostName}</p>
                  <p className="text-sm text-muted-foreground">房东</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center">
                  <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{trip.hostPhone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{trip.hostEmail}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{trip.hostEmail}</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rules">
              <h2 className="text-xl font-semibold mb-4">入住规则</h2>
              <div className="space-y-3">
                {trip.houseRules.map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <AlertCircle className="mr-3 h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">房源图片</h2>
        <div className="flex overflow-x-auto space-x-4">
          {trip.images.map((image, index) => (
            <img key={index} src={image} alt={`图片${index + 1}`} className="w-48 h-32 object-cover rounded-md" />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handleCancel} className="w-full md:w-auto">
          取消预订
        </Button>
        <Link to={`/trips/${id}/modify`}>
          <Button className="w-full md:w-auto">
            修改预订
          </Button>
        </Link>
        
      </div>
    </div>
  );
};

export default TripDetail;
