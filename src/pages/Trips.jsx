import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, Calendar, Star, MapPin, Users, Search, AlertCircle } from "lucide-react";
import { fetchBookings } from '@/services/BookingApi';
import { useAuth } from '@/components/commonComponents/AuthProvider';
import { API_BASE_URL } from '@/components/commonComponents/Constants';
import { mapStatusToDetails, getStatusLabel } from '@/components/commonComponents/Constants';
import { formatDate } from '@/components/utils/UtilFunctions';


const Trips = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();


  useEffect(() => {
    const loadTrips = async () => {
      try {
        const fetchedTrips = await fetchBookings(user.id);
        
        // 检查URL是否包含支付宝返回参数
        const urlParams = new URLSearchParams(window.location.search);
        const outTradeNo = urlParams.get('out_trade_no');
        const tradeNo = urlParams.get('trade_no');
        
        // 如果有支付宝返回参数且交易成功
        if (outTradeNo && tradeNo) {
          // 提取订单ID (out_trade_no格式为 "24_1743499184744"，前缀是订单ID)
          const bookingId = outTradeNo.split('_')[0];
          console.log('bookingId: ', bookingId);
          // 临时更新订单状态
          const updatedTrips = fetchedTrips.map(trip => {
            if (trip.id.toString() === bookingId) {
              return { ...trip, status: 2 }; // 更新为已付款状态
            }
            return trip;
          });
          
          setTrips(updatedTrips);
      
        } else {
          setTrips(fetchedTrips);
        }
        
        setLoading(false);
      } catch (err) {
        setError('无法加载预订信息');
        setLoading(false);
      }
    };

    loadTrips();
  }, [user.id]);



  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(trip => mapStatusToDetails(trip.status).string === filter);



  const handleBookingDetailNavigation = (booking) => {
    if (!booking || !booking.id) {
      console.error("无效的 booking 数据:", booking);
      return;
    }

  
    navigate(`/bookings/${booking.id}`, {
      state: {
        listing: booking.listingDetail || {}, // 防止 listingDetail 为空
        booking: booking
      }
    });
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">我的行程</h1>
          <p className="text-muted-foreground mt-1">管理您的住宿预订和查看历史记录</p>
        </div>
        <Link to="/search">
          <Button className="mt-4 lg:mt-0" size="sm">
            <Search className="mr-2 h-4 w-4" /> 浏览住宿
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>您的预订</CardTitle>
              <CardDescription>查看您的住宿预订和历史记录</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选预订" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有预订</SelectItem>
                <SelectItem value="paying">未支付</SelectItem>
                <SelectItem value="paying">支付中</SelectItem>
                <SelectItem value="paid">已付款</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>正在加载预订数据...</p>
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => {
                const statusDetails = mapStatusToDetails(trip.status);
                return (
                  <Card key={trip.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute top-2 right-2">
                        <Badge variant={statusDetails.variant}>
                          {statusDetails.label}
                        </Badge>
                      </div>
                      {trip.listingDetail.images && trip.listingDetail.images.length > 0 ? (
                        <img 
                          src={`${API_BASE_URL}${trip.listingDetail.images[0]}?timestamp=${new Date().getTime()}`} 
                          alt={trip.listingDetail.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Home className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{trip.listingDetail.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {trip.listingDetail.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {trip.guestCount} 位房客
                          </span>
                        </div>
                        {trip.listingDetail.rating !== null ? (
                          <div className="flex items-center">
                            <Star className="mr-2 h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">
                              {trip.listingDetail.rating}.0
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-400 italic">尚无评分</span>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <span className="font-medium">{trip.listingDetail.currency}{trip.totalAmount}</span>
                          <span className="text-sm text-muted-foreground ml-1">总价</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleBookingDetailNavigation(trip)}
                      >
                        详情
                      </Button>
                      {(() => {
                        switch(trip.status) {
                          case 0: // 未支付
                            return (
                              <Link to={`/trips/${trip.id}/pay`}>
                                <Button variant="outline" size="sm">
                                  去支付
                                </Button>
                              </Link>
                            );
                          case 1: // 支付中
                            return (
                              <Link to={`/trips/${trip.id}/pay`}>
                                <Button variant="outline" size="sm">
                                  继续支付
                                </Button>
                              </Link>
                            );
                          case 2: // 已付款
                            return (
                              <Link to={`/trips/${trip.id}/modify`}>
                                <Button variant="outline" size="sm">
                                  修改
                                </Button>
                              </Link>
                            );
                          case 3: // 已完成 TODO
                            return trip.listingDetail.rating === null ? (
                              <Link to={`/trips/${trip.id}/review`}>
                                <Button variant="outline" size="sm">
                                  评价
                                </Button>
                              </Link>
                            ) : (
                              <Link to="/search">
                                <Button variant="outline" size="sm">
                                  再次预订
                                </Button>
                              </Link>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">没有找到预订</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                您目前没有{filter !== 'all' ? getStatusLabel(filter) : ''}的记录。
              </p>
              <Link to="/search">
                <Button className="mt-4">
                  <Search className="mr-2 h-4 w-4" /> 浏览住宿
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default Trips;