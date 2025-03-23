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
import { fetchListing } from '@/services/ListingApi';
import { API_BASE_URL } from '@/components/common/Constants';
import FormattedDate from '@/components/utils/formattedDate';
import StarRating from '@/components/utils/StarRating';


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
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // 从后端获取房源详情数据
  useEffect(() => {
    const loadListingData = async () => {
      try {
        setLoading(true);
        // 使用API服务获取房源数据
        const listingData = await fetchListing(id);
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
      setTotalPrice(listing.price * nightCount + listing.cleaningFee + listing.serviceFee);
      
      // 检查所选日期是否可用
      const checkDateAvailability = async () => {
        try {
          setIsCheckingAvailability(true);
          const availabilityData = await checkAvailability(
            id, 
            selectedDates.from, 
            selectedDates.to
          );
          setIsAvailable(availabilityData.available);
        } catch (err) {
          console.error('Error checking availability:', err);
          // 默认为可用，避免阻止用户继续操作
          setIsAvailable(true);
        } finally {
          setIsCheckingAvailability(false);
        }
      };
      
      checkDateAvailability();
    }
  }, [id, listing, selectedDates]);

  const handleDateSelect = (range) => {
    setSelectedDates(range);
  };

  const handleBooking = () => {
    if (selectedDates.from && selectedDates.to && listing) {
      navigate(`/booking/${id}`, {
        state: {
          listing,
          dates: selectedDates,
          nights,
          totalPrice
        }
      });
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
            src={listing.images && listing.images[0] ? listing.images[0] : '默认图片URL'} 
            alt="主图" 
            className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
          />

        </div>
        {listing.images.length > 0 ? (
          listing.images.slice(1, 5).map((image, index) => (
            <div key={index}>
              <img
                src={image}
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
                  由 {listing.host.lastName}{listing.host.firstName} 出租的整套公寓
                </h2>
                <p className="text-muted-foreground">
                  {listing.maxGuests} 位客人 · {listing.bedrooms} 间卧室 · {listing.bathrooms} 间卫生间
                </p>
              </div>
              <Avatar>
                <AvatarImage src={`${API_BASE_URL}${listing.host.avatar}`}  />
                <AvatarFallback>{listing.host.firstName?.[0]}{listing.host.lastName?.[0]}</AvatarFallback>
              </Avatar>
               
            </div>
          </div>
          
          {/* 房源描述 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">房源描述</h2>
            <p>{listing.description}</p>
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
          
          {/* 评价 */}
          <div>
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
              
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate(`/listings/${id}/reviews`)}
              >
                查看全部 {reviews.length} 条评价
              </Button>
            </div>
          </div>
        </div>
        
        {/* 预订卡片 */}
        <div>
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
                    disabled={!selectedDates.from || !selectedDates.to || !isAvailable}
                    onClick={handleBooking}
                  >
                    预订
                  </Button>
                </>
              )}
              
              {selectedDates.from && selectedDates.to && (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">预订前无需付款</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>¥{listing.price} x {nights}晚</span>
                      <span>¥{listing.price * nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>清洁费</span>
                      <span>¥{listing.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>服务费</span>
                      <span>¥{listing.serviceFee}</span>
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