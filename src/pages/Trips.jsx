import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, Calendar, Star, MapPin, Users, Search, AlertCircle } from "lucide-react";

const Trips = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trips, settrips] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch trips
    setTimeout(() => {
      settrips([
        {
          id: 1,
          title: '现代化市中心公寓',
          location: '上海',
          address: '上海市静安区南京西路1788号',
          image: 'https://example.com/apartment1.jpg',
          checkIn: '2025-04-10',
          checkOut: '2025-04-15',
          status: 'upcoming',
          guests: 2,
          price: 680,
          totalPrice: 3400,
          rating: null,
          hostName: '王女士',
          hostImage: 'https://example.com/host1.jpg',
          amenities: ['无线网络', '空调', '厨房', '洗衣机']
        },
        {
          id: 2,
          title: '海景度假别墅',
          location: '三亚',
          address: '海南省三亚市亚龙湾度假区',
          image: 'https://example.com/villa1.jpg',
          checkIn: '2025-02-15',
          checkOut: '2025-02-22',
          status: 'completed',
          guests: 4,
          price: 1280,
          totalPrice: 8960,
          rating: 5,
          hostName: '李先生',
          hostImage: 'https://example.com/host2.jpg',
          amenities: ['无线网络', '泳池', '空调', '厨房', '停车位']
        },
        {
          id: 3,
          title: '古色古香的四合院',
          location: '北京',
          address: '北京市东城区交道口南大街',
          image: 'https://example.com/siheyuan.jpg',
          checkIn: '2024-12-10',
          checkOut: '2024-12-17',
          status: 'completed',
          guests: 3,
          price: 980,
          totalPrice: 6860,
          rating: 4,
          hostName: '赵先生',
          hostImage: 'https://example.com/host3.jpg',
          amenities: ['无线网络', '空调', '庭院', '自行车']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter trips based on status
  const filteredtrips = filter === 'all' 
    ? trips 
    : trips.filter(trip => trip.status === filter);

  // Format date to display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
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
                <SelectItem value="upcoming">即将入住</SelectItem>
                <SelectItem value="completed">已入住</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>正在加载预订数据...</p>
            </div>
          ) : filteredtrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredtrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute top-2 right-2">
                      <Badge variant={trip.status === 'upcoming' ? 'default' : 'secondary'}>
                        {trip.status === 'upcoming' ? '即将入住' : '已入住'}
                      </Badge>
                    </div>
                    {/* 这里可以放置一个实际的房源图片 */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{trip.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {trip.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(trip.checkIn)} - {formatDate(trip.checkOut)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {trip.guests} 位房客
                        </span>
                      </div>
                      {trip.rating !== null ? (
                        <div className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">
                            {trip.rating}.0
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-400 italic">尚无评分</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <span className="font-medium">￥{trip.totalPrice}</span>
                        <span className="text-sm text-muted-foreground ml-1">总价</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to={`/trips/${trip.id}`}>
                      <Button variant="ghost" size="sm">
                        详情
                      </Button>
                    </Link>
                    {trip.status === 'upcoming' ? (
                      <Link to={`/trips/${trip.id}/modify`}>
                        <Button variant="outline" size="sm">
                          修改
                        </Button>
                      </Link>
                    ) : trip.rating === null ? (
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
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">没有找到预订</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                您目前没有{filter !== 'all' ? filter === 'upcoming' ? '即将入住' : '已入住' : ''}的记录。
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

      {/* 住宿统计部分移至最下方 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">住宿统计</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">总住宿次数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{trips.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">即将入住</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{trips.filter(s => s.status === 'upcoming').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">已入住城市</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set(trips.filter(s => s.status === 'completed').map(s => s.location)).size}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">总住宿天数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {trips.reduce((total, trip) => {
                  const start = new Date(trip.checkIn);
                  const end = new Date(trip.checkOut);
                  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                  return total + days;
                }, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trips;