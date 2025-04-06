import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, ChevronsUpDown, Loader } from "lucide-react";
import { searchListings, fetchListingTypes, fetchAmenities } from '@/services/ListingApi';
import { updateFavorite } from '@/services/FavoritesApi';
import { useAuth } from '@/components/commonComponents/AuthProvider';


// 导入拆分的组件
import ListingCard from '../components/searchComponents/ListingCard';
import FilterPanel from '../components/searchComponents/FilterPanel';

// 常量定义
const DEFAULT_PRICE_RANGE = [0, Infinity];
const DEFAULT_FILTERS = {
  priceRange: DEFAULT_PRICE_RANGE,
  listingType: {}, // 将从API获取并填充
  bedrooms: 'any',
  bathrooms: 'any',
  amenities: {}  // 将从API获取并填充
};

/**
 * 房源搜索页面组件
 */
const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const {user} = useAuth();
  
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    listingTypes: [],
    amenities: []
  });
  
  // 从URL参数中获取搜索条件
  const [searchCriteria, setSearchCriteria] = useState({
    address: searchParams.get('address') || '',
    dateRange: {
      from: searchParams.get('from') ? new Date(searchParams.get('from')) : null,
      to: searchParams.get('to') ? new Date(searchParams.get('to')) : null
    },
    guests: parseInt(searchParams.get('guests') || '1', 10),
  });
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchResults, setSearchResults] = useState([]);
  
  // 获取过滤器选项
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [listingTypesResponse, amenitiesResponse] = await Promise.all([
          fetchListingTypes(),
          fetchAmenities()
        ]);
        
        // 更新选项状态
        setFilterOptions({
          listingTypes: listingTypesResponse,
          amenities: amenitiesResponse
        });

        // 初始化默认过滤器值
        const initialListingTypes = {};
        const initialAmenities = {};
        
        listingTypesResponse.forEach(type => {
          initialListingTypes[type.id] = false;
        });
        
        amenitiesResponse.forEach(amenity => {
          initialAmenities[amenity.id] = false;
        });
        
        // 更新过滤器状态
        setFilters(prev => ({
          ...prev,
          listingType: initialListingTypes,
          amenities: initialAmenities
        }));
      } catch (err) {
        console.error('获取过滤器选项失败:', err);
        setError('获取过滤器选项失败。');
      }
    };
    
    fetchFilterOptions();
  }, []);
  


  // 构建请求体
  const constructRequestBody = (criteria, filters, userId) => {
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
        listingType: Object.keys(filters.listingType).filter(key => filters.listingType[key]),
        bedrooms: filters.bedrooms !== 'any' ? filters.bedrooms : null,
        bathrooms: filters.bathrooms !== 'any' ? filters.bathrooms : null,
        amenities: Object.keys(filters.amenities).filter(key => filters.amenities[key])
      },
      userId: userId
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
    const requestBody = constructRequestBody(criteria, filterOptions, user?.id);

    // 判断请求体是否为空
    if (Object.keys(requestBody).length === 0) {
      return; // 如果没有有效的搜索条件，退出
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      const results = await searchListings(requestBody);

      // 确保结果是一个数组
      const validResults = Array.isArray(results) ? results : [];
      setSearchResults(validResults);

      if (filterOptions) {
        setShowFilters(false); // 应用过滤器后关闭过滤器面板
      }
    } catch (err) {
      console.error('获取搜索结果失败:', err);
      setError('获取搜索结果失败。');
      setSearchResults([]); // 失败时清空数据
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  

  // 页面加载时进行初始搜索
  useEffect(() => {
    // 等待过滤器选项加载完成后执行初始搜索
    if (Object.keys(filters.listingType).length > 0 && Object.keys(filters.amenities).length > 0) {
      performSearch(searchCriteria, filters);
    }
  }, [filters.listingType, filters.amenities]); 

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
    // 重置为初始状态，但保留从API获取的选项结构
    const resetListingTypes = {};
    const resetAmenities = {};
    
    Object.keys(filters.listingType).forEach(key => {
      resetListingTypes[key] = false;
    });
    
    Object.keys(filters.amenities).forEach(key => {
      resetAmenities[key] = false;
    });
    
    const resetFilters = {
      ...DEFAULT_FILTERS,
      listingType: resetListingTypes,
      amenities: resetAmenities
    };
    
    setFilters(resetFilters);
    performSearch(searchCriteria, resetFilters);
  }, [filters.listingType, filters.amenities, searchCriteria, performSearch]);
  

  // 应用过滤器
  const applyFilters = useCallback(() => {
    performSearch(searchCriteria, filters);
  }, [searchCriteria, filters, performSearch]);

  // 切换收藏状态
  const toggleFavorite = useCallback(async (id) => {
    try {
      // 找到当前项目并获取其反转后的收藏状态
      const currentItem = searchResults.find(item => item.id === id);
      const newFavoriteStatus = !currentItem.isFavorite;
      
      // 乐观更新UI
      setSearchResults(results => results.map(item => 
        item.id === id ? {...item, isFavorite: newFavoriteStatus} : item
      ));
      
      // 调用API函数更新后端
      await updateFavorite(user.id, id, newFavoriteStatus);
      
    } catch (error) {
      // 如果请求失败，回滚UI状态
      setSearchResults(results => results.map(item => 
        item.id === id ? {...item, isFavorite: !item.isFavorite} : item
      ));
      
      // 可以添加一些用户通知，如错误提示
      console.error('收藏状态更新失败');
    }
  }, [searchResults, user]);

    // 计算应用的过滤器数量
    const filtersApplied = useMemo(() => {
      let count = 0;
      
      // 检查价格范围
      if (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || 
          filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]) {
        count++;
      }
      
      // 检查房屋类型
      if (Object.values(filters.listingType).some(value => value)) {
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

  // 跳转到房源详情
  const navigateToListing = useCallback((id) => {
    
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onFavoriteToggle={toggleFavorite}
              onCardClick={navigateToListing}
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
          filterOptions={filterOptions}
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