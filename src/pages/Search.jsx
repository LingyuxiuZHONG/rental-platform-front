import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, ChevronsUpDown, Loader } from "lucide-react";
import { searchListings } from '@/services/listingApi';

// 导入拆分的组件
import PropertyCard from './search/PropertyCard';
import FilterPanel from './search/FilterPanel';
import propertyExamples from './search/PropertyExamples';
import axios from 'axios';

// 常量定义
const DEFAULT_PRICE_RANGE = [0, Infinity];
const DEFAULT_FILTERS = {
  priceRange: DEFAULT_PRICE_RANGE,
  propertyType: {
    house: false,
    apartment: false,
    condo: false,
    villa: false,
    cabin: false
  },
  bedrooms: 'any',
  bathrooms: 'any',
  amenities: {
    wifi: false,
    kitchen: false,
    ac: false,
    washer: false,
    pool: false,
    parking: false
  }
};



/**
 * 房源搜索页面组件
 */
const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 从URL参数中获取搜索条件
  const [searchCriteria, setSearchCriteria] = useState({
    address: searchParams.get('address') || '',
    dateRange: {
      from: searchParams.get('from') ? new Date(searchParams.get('from')) : null,
      to: searchParams.get('to') ? new Date(searchParams.get('to')) : null
    },
    guests: {
      adults: parseInt(searchParams.get('adults') || '1', 10),
      children: parseInt(searchParams.get('children') || '0', 10),
      infants: parseInt(searchParams.get('infants') || '0', 10)
    }
  });
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchResults, setSearchResults] = useState([]);
  
  // 计算应用的过滤器数量
  const filtersApplied = useMemo(() => {
    let count = 0;
    
    // 检查价格范围
    if (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || 
        filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]) {
      count++;
    }
    
    // 检查房屋类型
    if (Object.values(filters.propertyType).some(value => value)) {
      count++;
    }
    
    // 检查卧室数量
    if (filters.bedrooms !== 'any') {
      count++;
    }
    
    // 检查浴室数量
    if (filters.bathrooms !== 'any') {
      count++;
    }
    
    // 检查设施
    if (Object.values(filters.amenities).some(value => value)) {
      count++;
    }
    
    return count;
  }, [filters]);

  // 构建请求体
  const constructRequestBody = (criteria, filters) => {
    // 初始化请求体
    const requestBody = {
      address: criteria.address || null,
      dateRange: criteria.dateRange || null,
      guests: criteria.guests || {
        adults: 1,
        children: 0,
        infants: 0
      },
      filters: {
        priceRange: filters.priceRange || DEFAULT_PRICE_RANGE,
        propertyType: Object.keys(filters.propertyType).filter(key => filters.propertyType[key]),
        bedrooms: filters.bedrooms !== 'any' ? filters.bedrooms : null,
        bathrooms: filters.bathrooms !== 'any' ? filters.bathrooms : null,
        amenities: Object.keys(filters.amenities).filter(key => filters.amenities[key])
      }
    };
  
    // 过滤掉值为 null 或 undefined 的字段
    for (const key in requestBody) {
      if (requestBody[key] === null || requestBody[key] === undefined || 
          (Array.isArray(requestBody[key]) && requestBody[key].length === 0)) {
        delete requestBody[key]; // 删除无效字段
      }
    }
  
    return requestBody;
  };

  

  // 执行搜索
  const performSearch = useCallback(async (criteria, filterOptions) => {
    // 构建请求体
    const requestBody = constructRequestBody(criteria, filterOptions);
  
    // 判断请求体是否为空
    if (Object.keys(requestBody).length === 0) {
      return; // 如果没有有效的搜索条件，退出
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      const results = await searchListings(requestBody);

      // 确保结果是一个数组
      const validResults = Array.isArray(results.data) ? results.data : [];
      console.log('搜索结果', validResults);
      // const validResults = propertyExamples;
      setSearchResults(validResults);

      if (filterOptions) {
        setShowFilters(false); // 应用过滤器后关闭过滤器面板
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to load search results. Please try again.');
      setSearchResults([]); // 失败时清空数据
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  // 页面加载时进行初始搜索
  useEffect(() => {
    performSearch(searchCriteria, DEFAULT_FILTERS);
  }, []); 

  // 处理过滤器变更
  const handleFilterChange = useCallback((category, name, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' && !Array.isArray(prev[category])
        ? { ...prev[category], [name]: value }
        : value
    }));
  }, []);

  // 清除过滤器
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    performSearch(searchCriteria, DEFAULT_FILTERS);
  }, []);
  

  // 应用过滤器
  const applyFilters = useCallback(() => {
    // 构建过滤器参数
    const filterOptions = {
      priceRange: filters.priceRange,
      propertyType: Object.keys(filters.propertyType).filter(key => filters.propertyType[key]),
      bedrooms: filters.bedrooms !== 'any' ? filters.bedrooms : null,
      bathrooms: filters.bathrooms !== 'any' ? filters.bathrooms : null,
      amenities: Object.keys(filters.amenities).filter(key => filters.amenities[key])
    };
    
    performSearch(searchCriteria, filterOptions);
  }, [searchCriteria, filters, performSearch]);

  // 切换收藏状态
  const toggleFavorite = useCallback((id) => {
    setSearchResults(results => 
      results.map(item => 
        item.id === id ? {...item, isFavorite: !item.isFavorite} : item
      )
    );
  }, []);

  // 跳转到房源详情
  const navigateToProperty = useCallback((id) => {
    navigate(`/listings/${id}`);
  }, [navigate]);

  // 渲染搜索结果
  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading search results...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-16">
          <SearchIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {searchResults.length} properties
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <Button variant="outline" size="sm" className="flex items-center">
              Recommended <ChevronsUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onFavoriteToggle={toggleFavorite}
              onCardClick={navigateToProperty}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* 过滤器按钮 */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {filtersApplied > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {filtersApplied}
            </Badge>
          )}
        </Button>
      </div>

      {/* 过滤器面板 */}
      {showFilters && (
        <FilterPanel 
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          applyFilters={applyFilters}
          isLoading={isLoading}
          onCancel={() => setShowFilters(false)}
        />
      )}

      {/* 搜索结果 */}
      <div className="space-y-6">
        {renderSearchResults()}
      </div>

    </div>
  );
};

export default Search;