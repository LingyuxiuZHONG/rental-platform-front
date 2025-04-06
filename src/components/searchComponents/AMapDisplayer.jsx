import React, { useEffect, useRef } from 'react';

const AmapDisplayer = ({ address, latitude, longitude, zoom = 15 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    // 确保经纬度有效
    if (!latitude || !longitude) return;

    // 检查高德地图API是否已加载
    const initializeMap = () => {
      if (!window.AMap) {
        console.error('高德地图API未加载');
        return;
      }

      // 创建地图实例
      map.current = new window.AMap.Map(mapContainer.current, {
        zoom,
        center: [longitude, latitude],
        resizeEnable: true
      });

      // 添加标记
      marker.current = new window.AMap.Marker({
        position: [longitude, latitude],
        title: address,
        animation: 'AMAP_ANIMATION_DROP'
      });
      
      map.current.add(marker.current);
      
      // 添加控件
      map.current.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        map.current.addControl(new window.AMap.ToolBar());
        map.current.addControl(new window.AMap.Scale());
      });

      // 添加信息窗体
      if (address) {
        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="padding: 8px 0">${address}</div>`,
          offset: new window.AMap.Pixel(0, -30)
        });

        marker.current.on('mouseover', () => {
          infoWindow.open(map.current, marker.current.getPosition());
        });
        
        marker.current.on('mouseout', () => {
          infoWindow.close();
        });
      }
    };

    // 确保API已加载
    if (window.AMap) {
      initializeMap();
    } else {
      // 如果API还没加载，等待加载完成
      const checkForAMap = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkForAMap);
          initializeMap();
        }
      }, 100);
      
      // 5秒后停止检查，避免无限循环
      setTimeout(() => clearInterval(checkForAMap), 5000);
    }

    // 清理函数
    return () => {
      if (map.current) {
        map.current.destroy();
      }
    };
  }, [latitude, longitude, address, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-sm"
      style={{ border: '1px solid #e5e7eb' }}
    />
  );
};

export default AmapDisplayer;