import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { API_BASE_URL } from '@/components/commonComponents/Constants';
import { createPayment } from '@/services/PaymentApi';
import { useAuth } from '@/components/commonComponents/AuthProvider';
import { Separator } from "@/components/ui/separator";
import { createGuest } from '@/services/BookingApi';

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listing, dates, nights, totalAmount, bookingId, guestCount} = location.state || {}; // bookingUserId 是预订人的ID
  const { user } = useAuth(); // 获取当前登录用户的信息
  
  const [isSelfCheckIn, setIsSelfCheckIn] = useState(1); // 默认值根据预订用户判断是否是自己入住
  
  // 表单数据
  const [formData, setFormData] = useState({
    userId: isSelfCheckIn ? user.id : null,
    bookingId: bookingId,
    firstName: isSelfCheckIn ? user.firstName : '', 
    lastName: isSelfCheckIn ? user.lastName : '', 
    email: isSelfCheckIn ? user.email : '', 
    phone: isSelfCheckIn ? user.phoneNumber : '',
    guestCount: guestCount
  });

  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [agreeTerms, setAgreeTerms] = useState(false);


  // 选择是否为自己入住
  const handleCheckInChoice = (isSelf) => {
    setIsSelfCheckIn(isSelf);
    if (isSelf) {
      setFormData({
        ...formData,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber
      });
    } else {
      setFormData({
        ...formData,
        userId: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
    }
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  

    if (value.trim() === "") {
      setErrors({ ...errors, [name]: `${name} is required` });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 验证表单
    let hasError = false;
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "名字是必填项";
      hasError = true;
    }

    if (!formData.lastName) {
      newErrors.lastName = "姓氏是必填项";
      hasError = true;
    }

    if (!formData.email) {
      newErrors.email = "电子邮箱是必填项";
      hasError = true;
    }

    if (!formData.phone) {
      newErrors.phone = "手机号码是必填项";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return; 

    const amount = totalAmount;

    const status = 0;// 支付中

    await createGuest(formData);

    // 调用支付接口
    const result = await createPayment({ bookingId, amount, paymentMethod, status });

    console.log(result);

    const blob = new Blob([result], { type: 'text/html' });

    const url = URL.createObjectURL(blob);

    window.open(url, '_self');

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
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>入住信息</CardTitle>
                <CardDescription>请选择您是否是入住者并提供相关联系信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 选择入住人 */}
                <div className="flex items-center space-x-4">
                  <Button 
                    variant={isSelfCheckIn ? "default" : "outline"} 
                    onClick={() => handleCheckInChoice(true)}
                    type="button"
                  >
                    我是入住者
                  </Button>
                  <Button 
                    variant={!isSelfCheckIn ? "default" : "outline"} 
                    onClick={() => handleCheckInChoice(false)}
                    type="button"
                  >
                    不是我入住
                  </Button>
                </div>

                {/* 联系信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">名字</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isSelfCheckIn} // 如果是当前用户，字段不可编辑
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">姓氏</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isSelfCheckIn} // 如果是当前用户，字段不可编辑
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
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
                    disabled={isSelfCheckIn} // 如果是当前用户，字段不可编辑
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSelfCheckIn} // 如果是当前用户，字段不可编辑
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </CardContent>
            </Card>
            
            {/* 条款确认 */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    name="agreeTerms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => 
                      setAgreeTerms(checked)}
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
                  disabled={!agreeTerms}
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
                  src={`${API_BASE_URL}${listing.images[0]}`} 
                  alt={listing.title} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.address}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">日期</span>
                  <span>{formatDate(dates.from)} - {formatDate(dates.to)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">房客</span>
                  <div className="flex items-center gap-1">
                    <span className="w-8 text-center">{guestCount}人</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-lg font-semibold">价格详情</div>
                <div className="flex justify-between">
                  <span>¥{listing.price} x {nights}晚</span>
                  <span>¥{listing.price * nights}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold pt-2">
                  <span>总价</span>
                  <span>¥{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
