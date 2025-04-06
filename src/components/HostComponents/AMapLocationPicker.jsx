import React, { useState, useEffect, useRef } from 'react';

const AMapLocationPicker = ({
  onLocationSelect,
  placeholder = '请输入地址',
  zoom = 15,
  allowManualInput = true
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placeSearchRef = useRef(null);

  const [address, setAddress] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [location, setLocation] = useState([116.397428, 39.90923]); // 默认北京
  const [userEdited, setUserEdited] = useState(false);

  // 获取用户位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([longitude, latitude]); // 设置用户位置
          setIsLocationLoaded(true);
        },
        (error) => {
          console.error("定位失败:", error);
          setIsLocationLoaded(true); // 定位失败仍然加载地图
        }
      );
    } else {
      console.error("当前浏览器不支持 Geolocation API");
      setIsLocationLoaded(true);
    }
  }, []);

  // 初始化地图并加载插件
  useEffect(() => {
    if (!isLocationLoaded || !window.AMap) return;

    // 加载地图和插件
    const loadPlugins = () => {
      return new Promise((resolve, reject) => {
        if (!window.AMap) {
          reject('AMap JS API is not loaded');
          return;
        }

        window.AMap.plugin(
          ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Geocoder'],
          () => resolve()
        );
      });
    };

    loadPlugins()
      .then(() => {
        // 初始化地图
        const map = new window.AMap.Map(mapContainerRef.current, {
          zoom,
          center: location,
          resizeEnable: true
        });
        

        const marker = new window.AMap.Marker({
          position: location,
          draggable: true,
          cursor: 'move'
        });

        marker.setMap(map);

        // 地图点击事件
        map.on('click', (e) => {
          marker.setPosition(e.lnglat);
          setLocation([e.lnglat.lng, e.lnglat.lat]);
          geocodePosition(e.lnglat);
        });

        // 标记拖拽事件
        marker.on('dragend', () => {
          const position = marker.getPosition();
          setLocation([position.lng, position.lat]);
          geocodePosition(position);
        });

        // 自动完成服务
        const autocomplete = new window.AMap.AutoComplete({
          city: '全国',
          input: 'searchInput'
        });

        autocomplete.on('select', (e) => {
          placeSearchRef.current.search(e.poi.name, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              const poi = result.poiList.pois[0];
              const position = new window.AMap.LngLat(poi.location.lng, poi.location.lat);
              marker.setPosition(position);
              map.setCenter(position);
              setLocation([position.lng, position.lat]);
              setAddress(poi.address || poi.name);
              notifyLocationSelect(position.lng, position.lat, poi.address || poi.name);
            }
          });
        });

        // 初始化地理编码服务
        const geocodePosition = (lnglat) => {
          const geocoder = new window.AMap.Geocoder();
          geocoder.getAddress(lnglat, (status, result) => {
            console.log('Geocoding status:', status);
            console.log('Geocoding result:', result);

            if (status === 'complete' && result.info === 'OK') {
              const addressText = result.regeocode.formattedAddress;
              setAddress(addressText);
              console.log('Address resolved:', addressText);
              notifyLocationSelect(lnglat.lng, lnglat.lat, addressText);
            } else {
              setAddress('未知地址');
              console.error('Geocoding failed:', result.info);
              notifyLocationSelect(lnglat.lng, lnglat.lat, '未知地址');
            }
          });
        };

        // 通过当前位置进行地址解析
        geocodePosition(new window.AMap.LngLat(location[0], location[1]));

        mapRef.current = map;
        markerRef.current = marker;
        autocompleteRef.current = autocomplete;
        setIsMapReady(true);

        return () => {
          map.destroy();
        };
      })
      .catch((error) => {
        console.error('地图插件加载失败:', error);
      });
  }, [location, zoom]);

  // 通知父组件选择的位置信息
  const notifyLocationSelect = (lng, lat, addr) => {
    if (onLocationSelect) {
      onLocationSelect({ lng, lat, address: addr });
    }
  };

  // 手动搜索
  const handleSearch = () => {
    if (!placeSearchRef.current || !address) return;

    placeSearchRef.current.search(address, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        const poi = result.poiList.pois[0];
        const position = new window.AMap.LngLat(poi.location.lng, poi.location.lat);
        markerRef.current.setPosition(position);
        mapRef.current.setCenter(position);
        setLocation([position.lng, position.lat]);
        setAddress(poi.address || poi.name);
        notifyLocationSelect(position.lng, position.lat, poi.address || poi.name);
      }
    });
  };


  return (
    <div className="amap-location-picker w-full">
      <div className="mb-4 flex">
        <input
          id="searchInput"
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
          placeholder={placeholder}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setUserEdited(true); // 用户编辑标记
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
        />
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none"
          onClick={handleSearch}
        >
          搜索
        </button>
      </div>

      <div 
        ref={mapContainerRef} 
        className="w-full h-64 md:h-96 border border-gray-300 rounded"
      ></div>

      {isMapReady && (
        <div className="mt-2 text-sm text-gray-500">
          <p>当前位置: {address}</p>
          <p>坐标: 经度 {location[0].toFixed(6)}, 纬度 {location[1].toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default AMapLocationPicker;
