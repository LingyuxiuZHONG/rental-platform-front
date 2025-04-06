import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share, MapPin, Star, Users, Home, Wifi, Car, Utensils, Calendar as CalendarIcon } from 'lucide-react';
import { fetchListingReviews } from '@/services/ReviewsApi';
import { fetchListingDetail } from '@/services/ListingApi';
import { API_BASE_URL } from '@/components/commonComponents/Constants';
import FormattedDate from '@/components/utils/formattedDate';
import StarRating from '@/components/utils/StarRating';
import AmapDisplayer from '../components/searchComponents/AMapDisplayer';
import { useAuth } from '@/components/commonComponents/AuthProvider';
import { createBooking } from '@/services/BookingApi';
import { createChat } from '@/services/ChatApi';


const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDates, setSelectedDates] = useState({
    from: undefined,
    to: undefined
  });
  const [totalAmount, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const { user } = useAuth();
  const [guestCount, setGuestCount] = useState(1);
  const [bookingError, setBookingError] = useState(null);

  // 从后端获取房源详情数据
  useEffect(() => {
    const loadListingData = async () => {
      try {
        setLoading(true);
        // 使用API服务获取房源数据
        const listingData = await fetchListingDetail(id);
        setListing(listingData);

        // 使用API服务获取评价数据
        const reviewsData = await fetchListingReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadListingData();
    }
  }, [id]);

  // 当日期变化时，计算总价并检查可用性
  useEffect(() => {
    if (listing && selectedDates.from && selectedDates.to) {
      // 计算入住晚数
      const nightCount = Math.ceil(
        (selectedDates.to - selectedDates.from) / (1000 * 60 * 60 * 24)
      );
      setNights(nightCount);
      
      // 计算总价
      setTotalPrice(listing.price * nightCount);
      
      // 检查所选日期是否可用
      // const checkDateAvailability = async () => {
      //   try {
      //     setIsCheckingAvailability(true);
      //     const availabilityData = await checkAvailability(
      //       id, 
      //       selectedDates.from, 
      //       selectedDates.to
      //     );
      //     setIsAvailable(availabilityData.available);
      //   } catch (err) {
      //     console.error('Error checking availability:', err);
      //     // 默认为可用，避免阻止用户继续操作
      //     setIsAvailable(true);
      //   } finally {
      //     setIsCheckingAvailability(false);
      //   }
      // };
      
      // checkDateAvailability();
    }
  }, [id, listing, selectedDates]);

  const handleDateSelect = (range) => {
    setSelectedDates(range);
    // 清除之前可能存在的错误信息
    setBookingError(null);
  };

  const handleBooking = async () => {
    if (selectedDates.from && selectedDates.to && listing) {
      // 清除之前可能存在的错误信息
      setBookingError(null);
      
      console.log(listing);
      const listingId = listing.id;
      const bookingUserId = user.id;
      const hostId = listing.host.id;
      const startDate = selectedDates.from;
      const endDate = selectedDates.to;

      const response = await createBooking({
        listingId,
        bookingUserId,
        hostId,
        startDate,
        endDate,
        guestCount,
        totalAmount
      });

      if(response.code != 200){
        console.log(response.message);
        setBookingError(response.message);
        return;
      }

      const bookingId = response.data;

      navigate(`/booking/${id}`, {
        state: {
          listing,
          dates: selectedDates,
          nights,
          totalAmount,
          bookingId,
          guestCount
        }
      });
    }
  };

  const decrementGuests = () => {
    if (guestCount > 1) {
      setGuestCount(guestCount - 1);
    }
  };
  
  const incrementGuests = () => {
    setGuestCount(guestCount + 1);
    // 清除之前可能存在的错误信息
    setBookingError(null);
  };

  

  const handleContactHost = async () => {
    try {
      const chatId = await createChat({
        listingId: listing.id,
        hostId: listing.host.id,
        guestId: user.id
      })


      navigate(`/messages?chatId=${chatId}`, {
        state: { 
          otherUser: listing.host,
          listing: listing 
        }
      });
      
    } catch (error) {
      console.error("创建聊天失败:", error);
    }
  };

  // 加载状态显示
  if (loading) {
    return <div className="container mx-auto py-6 px-4 text-center">加载中...</div>;
  }

  // 错误状态显示
  if (error) {
    return <div className="container mx-auto py-6 px-4 text-center text-red-500">加载错误: {error}</div>;
  }

  // 数据未找到状态
  if (!listing) {
    return <div className="container mx-auto py-6 px-4 text-center">未找到房源信息</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center">
          {listing.rating ? (
            <>
              <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />            
              <span>{listing.rating}</span>
             <span className="mx-1">·</span>
              <span className="text-gray-500 text-sm ml-1">{reviews.length} 条评价</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm italic">尚无评分</span>
          )}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{listing.address}</span>
        </div>
        <div className="ml-auto flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            分享
          </Button> */}
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
            src={`${API_BASE_URL}${listing.images && listing.images[0] ? listing.images[0] : '默认图片URL'}`} 
            alt="主图" 
            className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
          />

        </div>
        {listing.images.length > 0 ? (
          listing.images.slice(1, 5).map((image, index) => (
            <div key={index}>
              <img
                src={`${API_BASE_URL}${image}`}
                alt={`图片${index + 2}`}
                className={`w-full h-full object-cover ${index === 1 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}
              />
            </div>
          ))
        ) : (
          // 如果没有图片，显示提示信息
          <p>暂无图片</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 房源信息 */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  由 {listing.host.lastName}{listing.host.firstName} 出租
                </h2>
                <p className="text-muted-foreground">
                  {listing.maxGuests} 位客人 · {listing.bedrooms} 间卧室 · {listing.bathrooms} 间卫生间
                </p>
              </div>
              <Avatar>
                <AvatarImage src={`${API_BASE_URL}${listing.host.avatar}`} className="object-cover"/>
                <AvatarFallback>{listing.host.firstName?.[0]}{listing.host.lastName?.[0]}</AvatarFallback>
              </Avatar>
               
            </div>
          </div>
          
          {/* 房源描述 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">房源描述</h2>
            <p>{listing.description}</p>
          </div>

          {/* 房东信息 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">关于房东</h2>
            <div className="flex items-start">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src={`${API_BASE_URL}${listing.host.avatar}`} />
                <AvatarFallback>{listing.host.firstName?.[0]}{listing.host.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{listing.host.lastName}{listing.host.firstName}</h3>
                <p className="text-muted-foreground text-sm mb-2">注册时间：<FormattedDate date={listing.host.createdAt} /></p>
                <p className="mb-2">{listing.host.description || "这位房东还没有添加自我介绍"}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>已接待 {listing.host.guestCount || 0} 位房客</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{listing.host.listingCount || 1} 处房源</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleContactHost}>
                  联系房东
                </Button>
              </div>
            </div>
          </div>
          
          {/* 设施 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">设施</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listing.amenities.map((amenity, index) => (
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
          
          {/* 地图位置 - 修改了这部分，添加了更清晰的边界和间距 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">房源位置</h2>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span>{listing.address}</span>
              </div>
            </div>
            
            {/* 地图组件 - 增加了边框和底部外边距 */}
            {listing.latitude && listing.longitude ? (
              <div className="border rounded-lg overflow-hidden mb-8">
                <AmapDisplayer 
                  address={listing.address}
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                  zoom={15}
                />
              </div>
            ) : (
              <div className="bg-muted w-full h-60 rounded-lg flex items-center justify-center mb-8 border">
                <p className="text-muted-foreground">地图信息暂不可用</p>
              </div>
            )}
            
            {/* 周边设施 */}
            {listing.nearbyFacilities && listing.nearbyFacilities.length > 0 && (
              <div className="mt-4 mb-6">
                <h3 className="font-medium mb-2">周边设施</h3>
                <div className="grid grid-cols-2 gap-4">
                  {listing.nearbyFacilities.map((facility, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-5 h-5 mt-0.5 mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <p>{facility}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 评价区域 - 添加了清晰的边界和独立的容器 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">评价</h2>
            <div className="flex items-center mb-4">
              {listing.rating ? (
                <>
                  <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                  <span>{listing.rating}</span>
                  <span className="mx-1">·</span>
                  <span className="text-lg">{reviews.length} 条评价</span>
                </>
              ) : (
                <span className="text-gray-400 text-sm italic">尚无评分</span>
              )}
            </div>
            
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.slice(0, 3).map(review => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-2">
                        <AvatarImage
                          src={`${API_BASE_URL}${review.reviewer.avatar}`}
                        />
                        <AvatarFallback>{review.reviewer.firstName?.[0]}{review.reviewer.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                     
                      <div>
                        <p className="font-medium">{review.reviewer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          <FormattedDate date={review.createdAt} /> 
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        <StarRating rating={review.rating} size="md" />
                      </div>
                    </div>
                    <p>{review.content}</p>
                  </div>
                ))
              ) : (
                // 没有评论时，显示提示信息
                <p>暂无评论</p>
              )}
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/listings/${id}/reviews`)}
                >
                  查看全部 {reviews.length} 条评价
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* 预订卡片 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-bold">¥{listing.price} <span className="text-sm font-normal">/ 晚</span></p>
                <div className="flex items-center">
                  {listing.rating != null ? (
                    <>
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span>{listing.rating}</span>
                      <span className="mx-1 text-muted-foreground">·</span>
                      <span className="text-gray-500 text-sm ml-1">{reviews.length} 条评价</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm italic">尚无评分</span>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <div className="text-center mb-2 font-medium">选择入住和退房日期</div>
                  <Calendar
                    mode="range"
                    selected={selectedDates}
                    onSelect={handleDateSelect}
                    className="border-0"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">房客数量</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={decrementGuests}
                        disabled={guestCount <= 1}
                      >
                        -
                      </Button>
                      <span>{guestCount}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={incrementGuests}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 显示预订错误信息 */}
              {bookingError && (
                <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                  {bookingError}
                </div>
              )}

              {isCheckingAvailability ? (
                <Button className="w-full mb-4" disabled>
                  正在检查可用性...
                </Button>
              ) : (
                <>
                  {!isAvailable && selectedDates.from && selectedDates.to && (
                    <div className="text-red-500 text-sm mb-2 text-center">
                      所选日期已被预订，请选择其他日期
                    </div>
                  )}
                  <Button 
                    className="w-full mb-4"
                    disabled={!selectedDates.from || !selectedDates.to || !isAvailable || guestCount < 1}
                    onClick={handleBooking}
                  >
                    预订
                  </Button>
                </>
              )}
              
              {/* 价格明细 */}
              {selectedDates.from && selectedDates.to && (
                <div className="space-y-4">                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>¥{listing.price} x {nights}晚</span>
                      <span>¥{listing.price * nights}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>总价</span>
                      <span>¥{totalAmount}</span>
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