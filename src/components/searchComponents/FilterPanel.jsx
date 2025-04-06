import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

const FilterPanel = ({ 
  filters, 
  filterOptions,
  handleFilterChange, 
  clearFilters, 
  applyFilters, 
  isLoading,
  onCancel 
}) => {
  // 格式化价格显示
  const formatPrice = (value) => {
    if (value === Infinity) return '不限';
    return `￥${value.toLocaleString()}`;
  };

  // 处理价格范围变化
  const handlePriceChange = (values) => {
    handleFilterChange('priceRange', null, values);
  };

  // 设施选择
  const renderAmenities = () => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {filterOptions.amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`amenity-${amenity.id}`}
              checked={filters.amenities[amenity.id] || false}
              onCheckedChange={(checked) => 
                handleFilterChange('amenities', amenity.id, checked)
              }
            />
            <Label htmlFor={`amenity-${amenity.id}`}>{amenity.name}</Label>
          </div>
        ))}
      </div>
    );
  };

  // 房屋类型选择
  const renderListingTypes = () => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {filterOptions.listingTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`listing-${type.id}`}
              checked={filters.listingType[type.id] || false}
              onCheckedChange={(checked) => 
                handleFilterChange('listingType', type.id, checked)
              }
            />
            <Label htmlFor={`listing-${type.id}`}>{type.name}</Label>
          </div>
        ))}
      </div>
    );
  };

  // 卧室数量选择
  const renderBedroomOptions = () => {
    const options = [
      { value: 'any', label: '不限' },
      { value: '1', label: '1 间' },
      { value: '2', label: '2 间' },
      { value: '3', label: '3 间' },
      { value: '4', label: '4 间' },
      { value: '5+', label: '5+ 间' }
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={filters.bedrooms === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('bedrooms', null, option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  // 浴室数量选择
  const renderBathroomOptions = () => {
    const options = [
      { value: 'any', label: '不限' },
      { value: '1', label: '1 间' },
      { value: '2', label: '2 间' },
      { value: '3', label: '3 间' },
      { value: '4+', label: '4+ 间' }
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={filters.bathrooms === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('bathrooms', null, option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 价格范围 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">价格范围</h3>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
            <Slider
              defaultValue={filters.priceRange}
              min={0}
              max={10000}
              step={100}
              onValueChange={handlePriceChange}
            />
          </div>
        </div>

        {/* 房屋类型 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">房屋类型</h3>
          {filterOptions.listingTypes.length > 0 ? (
            renderListingTypes()
          ) : (
            <div className="flex items-center">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span>加载中...</span>
            </div>
          )}
        </div>

        {/* 卧室数量 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">卧室数量</h3>
          {renderBedroomOptions()}
        </div>

        {/* 浴室数量 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">浴室数量</h3>
          {renderBathroomOptions()}
        </div>

        {/* 设施选项 */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">设施选项</h3>
          {filterOptions.amenities.length > 0 ? (
            renderAmenities()
          ) : (
            <div className="flex items-center">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={clearFilters}
        >
          清除过滤器
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            取消
          </Button>
          <Button 
            onClick={applyFilters}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                应用中...
              </>
            ) : (
              '应用过滤器'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;