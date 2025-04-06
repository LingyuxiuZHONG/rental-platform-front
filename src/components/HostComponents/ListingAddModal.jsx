import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImagePlus, X, MapPin, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { fetchListingType } from '@/services/HostListingApi';
import AMapLocationPicker from './AMapLocationPicker';
import { uploadListingImages } from '@/services/ResourceApi';
import { createListing } from '@/services/HostListingApi';
import { useAuth } from '@/components/commonComponents/AuthProvider';
import { fetchAmenities } from '@/services/ListingApi';


const ListingAddModal = ({ open, onOpenChange, onAddListing }) => {
  const [step, setStep] = useState(1); // 1: 基础信息, 2: 地图位置, 3: 图片上传
  
  
  const [images, setImages] = useState([]);
  const { user } = useAuth();

  const [newListing, setNewListing] = useState({
    title: '',
    address: '',
    listingType: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    description: '',
    maxGuests: '',
    longitude: '',
    latitude: '',
    listingTypeId: '',
    checkInInstructions: '', 
    cancelPolicy: '',
    hostId: user.id,
    amenities: [],
    rules: []
  });

  const [isDragging, setIsDragging] = useState(false);
  const [listingTypes, setListingTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  
  // 取消政策选项
  const cancelPolicyOptions = [
    { value: '0', label: '灵活（入住 24 小时前取消全额退款）' },
    { value: '1', label: '中等（入住 7 天前取消全额退款，否则退 50%）' },
    { value: '2', label: '严格（不退款或只退 20%）' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingTypeResponse = await fetchListingType();
        setListingTypes(listingTypeResponse);

        const amenitiesResponse = await fetchAmenities();
        setAmenities(amenitiesResponse);

      } catch (error) {
        console.error('获取房源类型失败:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewListing(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSelectChange = (field, value) => {
    if (field === 'listingType') {
      // 找到与所选名称匹配的类型对象
      const selectedType = listingTypes.find(type => type.name === value);
      
      // 同时更新类型名称和ID
      setNewListing(prev => ({
        ...prev,
        listingType: value,
        listingTypeId: selectedType?.id // 保存类型ID
      }));
    } else {
      // 处理其他选择字段
      setNewListing(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleLocationChange = ({ latitude, longitude, address }) => {
    setNewListing(prev => ({
      ...prev,
      latitude,
      longitude,
      address: address || prev.address
    }));
  };

  // 处理设施选择变化
  const handleAmenityChange = (amenityId) => {
    setNewListing(prev => {
      // 检查是否已经选择了该设施
      const isSelected = prev.amenities.includes(amenityId);
      
      // 根据是否已选择来添加或删除设施ID
      const updatedAmenities = isSelected
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      
      return {
        ...prev,
        amenities: updatedAmenities
      };
    });
  };
  
  const validateStep1 = () => {
    const errors = {};
    
    if (!newListing.title.trim()) errors.title = '请输入房源名称';
    if (!newListing.price) errors.price = '请输入价格';
    if (!newListing.listingType) errors.listingType = '请输入房源类型';
    if (!newListing.maxGuests) errors.maxGuests = '请输入最大入住人数';
    if (!newListing.bedrooms) errors.bedrooms = '请输入房间数';
    if (!newListing.bathrooms) errors.bathrooms = '请输入浴室数';
    if (!newListing.cancelPolicy) errors.cancelPolicy = '请选择取消政策';


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const validateStep2 = () => {
    const errors = {};
    
    if (!newListing.address.trim()) errors.address = '请输入地址';
    if (!newListing.latitude || !newListing.longitude) errors.location = '请在地图上选择位置';
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleAddListing = async () => {
    try {
      
      // 处理数据类型转换
      const processedListing = {
        ...newListing,
        hostId: user.id
      };
  
  
      // 创建房源
      const listing = await createListing(processedListing);
      
      // 上传图片并获取URL
      let imagesUrl = [];
      if (images && images.length > 0) {
        imagesUrl = await uploadListingImages(listing.id, images);
      }
  
      
      // 将完整的房源信息（包括图片URL）传递给父组件
      onAddListing({
        ...listing,
        images: imagesUrl
      });
  
      // 重置表单
      resetForm();
      
    } catch (error) {
      console.error("添加房源时出错:", error);
      alert(`添加房源失败: ${error.message || "发生未知错误"}`);
    } 
  };
  
  const resetForm = () => {
    setNewListing({
      title: '',
      address: '',
      listingType: '',
      bedrooms: '',
      bathrooms: '',
      price: '',
      description: '',
      maxGuests: '',
      latitude: null,
      longitude: null, 
      images: [],
      checkInInstructions: '',
      cancelPolicy: '',
      amenities: [],
      rules: []
    });
    setFormErrors({});
    setStep(1);
  };

  const [ruleInput, setRuleInput] = useState("");

  const handleAddRule = () => {
    if (ruleInput.trim() === "") return;
    setNewListing(prev => ({
      ...prev,
      rules: [...prev.rules, ruleInput.trim()]
    }));
    setRuleInput(""); // 清空输入框
  };

  const handleRemoveRule = (index) => {
    setNewListing(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };
  
  const handleImageUpload = (files) => {
    // 转换为数组
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
  
    if (imageFiles.length === 0) return;
  
    // 创建包含文件和临时 URL 的对象
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
  
    // 将新的图片对象数组添加到当前 images 状态
    setImages(prev => [...prev, ...newImages]);
  }
  
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files);
    }
  };

  const handleLocationSelect = (locationData) => {
    const { lng, lat, address } = locationData;
    
    setNewListing(prev => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      address: address || prev.address
    }));
    
    // 清除位置错误
    if (formErrors.location) {
      setFormErrors(prev => ({ ...prev, location: null }));
    }
  };
  
  const removeImage = (index) => {
    setImages(prev => {
      // 直接对 prev 进行操作，假设 prev 是一个数组
      const newImages = [...prev];
      // 释放对象URL以避免内存泄漏
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };
  
  // 步骤指示器
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          1
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          2
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          3
        </div>
      </div>
    </div>
  );

  // 将amenities分组显示
  const renderAmenitiesGroups = () => {
    // 假设我们按type分组，如果后端没有提供type字段，可以根据需求调整分组逻辑
    if (!amenities || amenities.length === 0) return null;
    
    // 渲染分组
    return (
        <div className="grid grid-cols-2 gap-2">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity.id}`}
                checked={newListing.amenities.includes(amenity.id)}
                onCheckedChange={() => handleAmenityChange(amenity.id)}
              />
              <label 
                htmlFor={`amenity-${amenity.id}`}
                className="text-sm cursor-pointer"
              >
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">房源名称<span className="text-red-500">*</span></Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={newListing.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500" : ""}
                  placeholder="输入房源标题"
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="listingType" className="text-right font-medium">房源类型<span className="text-red-500">*</span></Label>
              <div className="col-span-3">
                <Select
                  value={newListing.listingType}
                  onValueChange={(value) => handleSelectChange('listingType', value)}
                >
                  <SelectTrigger className={formErrors.listingType ? "border-red-500" : ""}>
                    <SelectValue placeholder="选择房源类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.listingType && <p className="text-red-500 text-xs mt-1">{formErrors.listingType}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="maxGuests" className="text-right font-medium">最大入住人数<span className="text-red-500">*</span></Label>
                <div>
                  <Input
                    id="maxGuests"
                    name="maxGuests"
                    type="number"
                    min="1"
                    value={newListing.maxGuests}
                    onChange={handleInputChange}
                    className={formErrors.maxGuests ? "border-red-500" : ""}
                  />
                  {formErrors.maxGuests && <p className="text-red-500 text-xs mt-1">{formErrors.maxGuests}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="price" className="text-right font-medium">价格 (元/晚)<span className="text-red-500">*</span></Label>
                <div>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    min="0" 
                    value={newListing.price} 
                    onChange={handleInputChange} 
                    className={formErrors.price ? "border-red-500" : ""}
                  />
                  {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bedrooms" className="text-right font-medium">卧室数量<span className="text-red-500">*</span></Label>
                <div>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={newListing.bedrooms}
                    onChange={handleInputChange}
                    className={formErrors.bedrooms ? "border-red-500" : ""}
                  />
                  {formErrors.bedrooms && <p className="text-red-500 text-xs mt-1">{formErrors.bedrooms}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bathrooms" className="text-right font-medium">浴室数量<span className="text-red-500">*</span></Label>
                <div>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    value={newListing.bathrooms}
                    onChange={handleInputChange}
                    className={formErrors.bathrooms ? "border-red-500" : ""}
                  />
                  {formErrors.bathrooms && <p className="text-red-500 text-xs mt-1">{formErrors.bathrooms}</p>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cancelPolicy" className="text-right font-medium">取消政策<span className="text-red-500">*</span></Label>
              <div className="col-span-3">
                <Select
                  value={newListing.cancelPolicy}
                  onValueChange={(value) => handleSelectChange('cancelPolicy', value)}
                >
                  <SelectTrigger className={formErrors.cancelPolicy ? "border-red-500" : ""}>
                    <SelectValue placeholder="选择取消政策" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancelPolicyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.cancelPolicy && <p className="text-red-500 text-xs mt-1">{formErrors.cancelPolicy}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right font-medium pt-2">描述</Label>
              <Textarea
                id="description"
                name="description"
                value={newListing.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
                placeholder="描述您的房源特点、设施等信息"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="checkInInstructions" className="text-right font-medium pt-2">入住说明</Label>
              <div className="col-span-3">
                <Textarea
                  id="checkInInstructions"
                  name="checkInInstructions"
                  value={newListing.checkInInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="例如：到达后请联系房东，我会告诉您如何获取钥匙和进入公寓。请在下午3点后办理入住。"
                />
                {formErrors.checkInInstructions && <p className="text-red-500 text-xs mt-1">{formErrors.checkInInstructions}</p>}
              </div>
            </div>

            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rules" className="text-right font-medium">
                  入住规则
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="rules"
                    value={ruleInput}
                    onChange={(e) => setRuleInput(e.target.value)}
                    placeholder="输入一条规则"
                  />
                  <Button onClick={handleAddRule} variant="secondary">
                    添加
                  </Button>
                </div>
              </div>

              {/* 已添加规则列表 */}
              {newListing.rules.length > 0 && (
                <div className="mt-2 space-y-2">
                  {newListing.rules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{rule}</span>
                      <Button onClick={() => handleRemoveRule(index)} size="sm" variant="ghost">
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            
            {/* 设施选择部分 */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right font-medium pt-2">可用设施</Label>
              <div className="col-span-3 border rounded-md p-3">
                <h3 className="text-sm font-medium mb-3">选择您提供的设施和服务</h3>
                {amenities && amenities.length > 0 ? (
                  renderAmenitiesGroups()
                ) : (
                  <p className="text-sm text-gray-500">正在加载设施列表...</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="grid gap-5 py-4">
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right font-medium pt-2">地图位置<span className="text-red-500">*</span></Label>
              <div className="col-span-3">
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      {newListing.latitude && newListing.longitude 
                        ? `已选择位置: ${newListing.latitude.toFixed(6)}, ${newListing.longitude.toFixed(6)}`
                        : '请在地图上选择位置'}
                    </span>
                  </div>
                  
                  <div className="h-80 w-full rounded overflow-hidden border">
                    <AMapLocationPicker 
                      onLocationSelect={handleLocationSelect}
                      placeholder="搜索地址"
                      zoom={14}
                    />
                  </div>
                  
                  {formErrors.location && (
                    <p className="text-red-500 text-xs mt-2">{formErrors.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="grid gap-5 py-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-medium">添加房源图片</h3>
              <p className="text-sm text-gray-500 mt-1">上传高质量图片以吸引更多客户</p>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mx-auto w-full ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <ImagePlus className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">拖放图片到此处或</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  选择图片
                </Button>
              </label>
            </div>
            
            {/* 图片预览区 */}
            {images.length > 0 ? (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">已上传 {images.length} 张图片:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-40 border group">
                      <img
                        src={image.preview}
                        alt={`房源图片 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-2 px-3 transform translate-y-full transition-transform group-hover:translate-y-0">
                        <p className="truncate">{image.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                <p>还没有添加图片</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">添加新房源</DialogTitle>
          <DialogDescription>
            {step === 1 ? '填写基本信息' : step === 2 ? '选择地理位置' : '上传房源图片'}
          </DialogDescription>
        </DialogHeader>
        
        <StepIndicator />
        
        {renderStepContent()}
        
        <DialogFooter className="flex justify-between mt-6 pt-4 border-t">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> 上一步
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>取消</Button>
            {step < 3 ? (
              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 flex items-center">
                下一步 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleAddListing} className="bg-green-600 hover:bg-green-700 flex items-center">
                完成 <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListingAddModal;