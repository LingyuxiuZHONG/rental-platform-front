import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { Calendar, CreditCard, User, MapPin } from 'lucide-react';

const Booking = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { listing, dates, nights, totalPrice } = location.state || {
    listing: {
      id: 1,
      title: '现代海景公寓',
      location: '上海市浦东新区陆家嘴',
      price: 688,
      cleaningFee: 100,
      serviceFee: 50,
      image: '/api/placeholder/200/150'
    },
    dates: {
      from: new Date(2025, 2, 15),
      to: new Date(2025, 2, 18)
    },
    nights: 3,
    totalPrice: 2214
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    purpose: '休闲旅行',
    specialRequests: '',
    agreeTerms: false
  });

  const [paymentMethod, setPaymentMethod] = useState('alipay');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      purpose: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交预订', { formData, paymentMethod, listing, dates });
    // 实际应用中应该将数据发送到后端
    // 完成后跳转到确认页面
    navigate('/trips', { 
      state: { 
        bookingConfirmed: true,
        listing,
        dates,
        totalPrice
      } 
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy年MM月dd日');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">确认并付款</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* 旅行信息 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>旅行信息</CardTitle>
                <CardDescription>您的旅行日期和目的</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">日期</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(dates.from)} - {formatDate(dates.to)} · {nights}晚
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label>旅行目的</Label>
                  <RadioGroup 
                    defaultValue={formData.purpose}
                    onValueChange={handleRadioChange}
                    className="flex flex-col space-y-1 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="休闲旅行" id="leisure" />
                      <Label htmlFor="leisure">休闲旅行</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="商务旅行" id="business" />
                      <Label htmlFor="business">商务旅行</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="其他" id="other" />
                      <Label htmlFor="other">其他</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* 联系信息 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>联系信息</CardTitle>
                <CardDescription>请提供您的联系方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">名字</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">姓氏</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">电子邮箱</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">预订确认和接收通知</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">房东或客服可能需要联系您</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">特殊要求（可选）</Label>
                  <Textarea 
                    id="specialRequests" 
                    name="specialRequests"
                    placeholder="有什么特殊需求请告诉我们"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* 支付方式 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>支付方式</CardTitle>
                <CardDescription>选择您喜欢的支付方式</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="alipay">支付宝</TabsTrigger>
                    <TabsTrigger value="wechat">微信支付</TabsTrigger>
                    <TabsTrigger value="card">信用卡</TabsTrigger>
                  </TabsList>
                  <TabsContent value="alipay" className="p-4 border rounded-md mt-4">
                    <div className="flex justify-center items-center py-4">
                      <div className="text-center">
                        <div className="bg-blue-50 p-6 rounded-lg mb-4">
                          <img src="/api/placeholder/100/100" alt="支付宝二维码" className="mx-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground">提交订单后，将跳转到支付宝完成支付</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="wechat" className="p-4 border rounded-md mt-4">
                    <div className="flex justify-center items-center py-4">
                      <div className="text-center">
                        <div className="bg-green-50 p-6 rounded-lg mb-4">
                          <img src="/api/placeholder/100/100" alt="微信支付二维码" className="mx-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground">提交订单后，将跳转到微信支付完成支付</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="card" className="p-4 border rounded-md mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">卡号</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">有效期</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">安全码</Label>
                          <Input id="cvc" placeholder="CVC" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* 条款确认 */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, agreeTerms: checked})}
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      我同意预订条款
                    </label>
                    <p className="text-sm text-muted-foreground">
                      点击"确认并付款"，即表示您同意房东的房屋规则，退订政策以及平台服务条款。
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full" 
                  disabled={!formData.agreeTerms}
                >
                  确认并付款
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        {/* 预订摘要 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>预订详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.location}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">日期</span>
                  <span>{formatDate(dates.from)} - {formatDate(dates.to)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">房客</span>
                  <span>2位成人</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-lg font-semibold">价格详情</div>
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
                <Separator />
                <div className="flex justify-between font-bold pt-2">
                  <span>总价</span>
                  <span>¥{totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;