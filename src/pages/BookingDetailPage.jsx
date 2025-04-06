import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  User, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  FileText,
  Mail,
  Phone,
  ChevronLeft,
  Users,
  Home,
  Star,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { API_BASE_URL } from '@/components/commonComponents/Constants';
import { useAuth } from '@/components/commonComponents/AuthProvider';
import { fetchOtherUser } from '@/services/UserApi';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchPayment } from '@/services/PaymentApi';
import BookingCancellationDialog from '../components/bookingComponents/BookingCancellationDialog';
import { cancelBooking } from '@/services/BookingApi';
import { formatDate, calculateDays } from '@/components/utils/UtilFunctions';
import { mapStatusToDetails } from '@/components/commonComponents/Constants';


const BookingDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listing, booking } = location.state || {};
  const { user } = useAuth();
  
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(booking);
  const [isCancellationDialogOpen, setIsCancellationDialogOpen] = useState(false);


  // 确定要获取的信息：如果当前用户是房东，获取房客信息；否则获取房东信息
  const otherUserId = user.id === updatedBooking.hostId ? updatedBooking.bookingUserId : updatedBooking.hostId;

  useEffect(() => {
    const fetchOtherUserInfo = async () => {
      try {
        const response = await fetchOtherUser(otherUserId);
        setOtherUser(response);
      } catch (error) {
        console.error('获取用户信息出错:', error);
      }
    };

    const fetchPaymentInfo = async () => {
      try {
        const response = await fetchPayment(updatedBooking.id);
        setPayment(response);
        
      }catch (error) {
        console.error('获取支付信息出错', error);
      }
    };

    if (otherUserId) {
      fetchOtherUserInfo();
    }
    fetchPaymentInfo();
    setLoading(false);

  }, [otherUserId]);

  
  const getStatusBadge = (status) => {
    const { label, variant } = mapStatusToDetails(status);
    return <Badge variant={variant}>{label}</Badge>;
  };

  const handleConfirmCancel = async (cancelDetails) => {
    try {
        console.log(cancelDetails);
        const response = await cancelBooking(booking.id, cancelDetails);

        if (response?.bookingVO) {
            setUpdatedBooking(response.bookingVO);
        }
        if (response?.paymentVO) {
            setPayment(response.paymentVO);
        }
    } catch (error) {
        console.error("取消预订失败:", error);
    }
};


  const handleConfirmBooking = () => {
    alert(user.id === updatedBooking.hostId ? '确定要确认这个预订吗？' : '无法执行此操作');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <p>正在加载预订详情...</p>
      </div>
    );
  }

  const isHost = user.id === updatedBooking.hostId;
  const otherUserName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Link to={isHost ? "/host" : "/trips"}>
            <Button variant="ghost" className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mr-4">{'预订详情'}</h1>
          {getStatusBadge(updatedBooking.status)}
        </div>
        <div className="flex mt-4 md:mt-0">
          <Link to={`/messages/${updatedBooking.id}`}>
            <Button variant="outline" className="mr-2" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" /> 
              {isHost ? '联系房客' : '联系房东'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 预订总览 */}
      <Card className="mb-8">
        <div className="aspect-video w-full bg-muted relative">
          {listing?.images && listing.images.length > 0 ? (
            <img 
              src={`${API_BASE_URL}${listing.images[0]}?timestamp=${new Date().getTime()}`}
              alt="房源图片" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Home className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="pt-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">预订信息</TabsTrigger>
              <TabsTrigger value="payment">支付信息</TabsTrigger>
              <TabsTrigger value={isHost ? 'guest' : 'host'}>
                {isHost ? '房客' : '房东'}信息
              </TabsTrigger>
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
                          <p className="text-muted-foreground">{formatDate(updatedBooking.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">退房日期</p>
                          <p className="text-muted-foreground">{formatDate(updatedBooking.endDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">地址</p>
                          <p className="text-muted-foreground">{listing.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">房客</p>
                          <p className="text-muted-foreground">{listing.maxGuests} 位房客</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">房源介绍</h2>
                    <p className="text-muted-foreground mb-4">{listing.description}</p>
                    <h3 className="font-medium mt-4 mb-2">设施和服务</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {listing.amenities.map((amenity, index) => (
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
                  <p className="text-muted-foreground">{listing.checkInInstructions}</p>
                </div>
            </TabsContent>
            
            <TabsContent value="payment">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">支付详情</h2>
              <Card className="shadow-md border-gray-200">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">￥{listing.price} x {calculateDays(updatedBooking.startDate,updatedBooking.endDate)} 晚</span>
                      <span className="font-semibold">￥{listing.price * calculateDays(updatedBooking.startDate,updatedBooking.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                      <span className="text-green-600">优惠</span>
                      <span className="text-green-800 font-medium">￥{updatedBooking.discountAmount}</span>
                    </div>
                    <Separator className="my-2 bg-gray-300" />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="text-gray-800">总计</span>
                      <span className="text-primary">￥{updatedBooking.paidAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              
              {payment && (
                <div className="mt-6 bg-white shadow-sm border border-gray-100 rounded-lg p-4">
                  {/* 支付方式（仅适用于状态 1, 3, 4） */}
                  {[1, 3, 4].includes(payment.status) && (
                    <>
                      <h3 className="font-semibold text-lg mb-3 text-gray-700">支付信息</h3>
                      <div className="flex items-center">
                        <CreditCard className="mr-3 h-6 w-6 text-primary" />
                        <div>
                          <p className="text-gray-800 font-medium">{payment.paymentMethod}</p>
                          {payment.paidAt && (
                            <p className="text-sm text-gray-500">
                              交易日期: {new Date(payment.paidAt).toLocaleString('zh-CN')}
                            </p>
                          )}
                          {payment.transactionId && (
                            <p className="text-sm text-gray-500">
                              交易编号: {payment.transactionId}
                            </p>
                          )}
                          {payment.amount && (
                            <p className="text-sm text-gray-500">
                              交易金额: {payment.amount}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* 退款信息（仅适用于状态 3） */}
                  {payment.status === 3 && (
                    <>
                      <h3 className="font-semibold text-lg mb-3 text-gray-700 mt-4">退款信息</h3>
                      <div className="flex items-center">
                        <RotateCcw className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <p className="text-gray-800 font-medium">{payment.refundMethod}</p>
                          {payment.refundedAt && (
                            <p className="text-sm text-gray-500">
                              退款日期: {new Date(payment.refundedAt).toLocaleString('zh-CN')}
                            </p>
                          )}
                          {payment.refundTransactionId && (
                            <p className="text-sm text-gray-500">
                              退款交易编号: {payment.refundTransactionId}
                            </p>
                          )}
                          {payment.refundAmount && (
                            <p className="text-sm text-gray-500">
                              退款金额: {payment.refundAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
                        

            </TabsContent>
            
            <TabsContent value={isHost ? 'guest' : 'host'}>
              <h2 className="text-xl font-semibold mb-4">
                {isHost ? '房客' : '房东'}信息
              </h2>
              {otherUser && (
                <div>
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage 
                        src={`${API_BASE_URL}${otherUser.avatar}`} 
                        className="object-cover rounded-full"
                      />
                      <AvatarFallback className="bg-gray-200">
                        {otherUser.firstName?.[0]}{otherUser.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  <div>
                    <p className="font-medium">{otherUserName}</p>
                    <p className="text-sm text-muted-foreground">
                      {isHost ? '房客' : '房东'}
                    </p>
                  </div>
                </div>
                  
                <div className="space-y-3 mt-4">
                  <div className="flex items-center">
                    <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>{otherUser.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>{otherUser.email}</span>
                  </div>
                </div>
                </div>
                
              )}
            </TabsContent>
            <TabsContent value="rules">
              <h2 className="text-xl font-semibold mb-4">入住规则</h2>
              <div className="space-y-3">
                {listing.rules.map((rule, index) => (
                  <div className="flex items-start">
                    <AlertCircle className="mr-3 h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
              
        {/* 操作按钮 */}
        <div className="mt-6 flex justify-between p-4">
          {(updatedBooking.status === 0 || updatedBooking.status === 1 || updatedBooking.status === 2) && (
            <Button 
              variant="destructive" 
              onClick={() => setIsCancellationDialogOpen(true)}
              className="w-full md:w-auto"
            >
              {isHost ? '拒绝预订' : '取消预订'}
            </Button>
          )}
          

          {(updatedBooking.status === 0 || updatedBooking.status === 1 || updatedBooking.status === 2) && isHost && (
            <Button 
              variant="default" 
              onClick={handleConfirmBooking} 
              className="w-full md:w-auto"
            >
              确认预订
            </Button>
          )}
        </div>
        <BookingCancellationDialog 
          isOpen={isCancellationDialogOpen}
          onClose={() => setIsCancellationDialogOpen(false)}
          booking={updatedBooking}
          isHost={isHost}
          onConfirmCancel={handleConfirmCancel}
          cancelPolicy={listing.cancelPolicy}
        />
      </Card>
    </div>
  );
};

export default BookingDetailPage;