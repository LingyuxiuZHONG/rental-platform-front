// src/pages/Home.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from 'react';


// 假设这些是从API获取的热门房源数据
const popularListings = [
  { id: 1, title: "海景公寓", location: "三亚", price: 688, rating: 4.8, imageUrl: "/api/placeholder/400/200" },
  { id: 2, title: "现代市中心套房", location: "上海", price: 498, rating: 4.6, imageUrl: "/api/placeholder/400/200" },
  { id: 3, title: "古色古香四合院", location: "北京", price: 1288, rating: 4.9, imageUrl: "/api/placeholder/400/200" },
  { id: 4, title: "山景小木屋", location: "杭州", price: 358, rating: 4.7, imageUrl: "/api/placeholder/400/200" },
];

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative rounded-xl overflow-hidden h-96 mb-12">
        <img 
          src="/img/home-page-img.jpg" 
          alt="Beautiful Rental Destination" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 z-10">
          <h1 className="text-4xl font-bold mb-6 text-shadow-lg">探索全球独特的住宿</h1>
          <p className="text-lg text-shadow-md">找到理想的居所</p>
        </div>
      </div>
      
      {/* 热门房源 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">热门房源</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{listing.title}</h3>
                <p className="text-gray-500">{listing.location}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">¥{listing.price}/晚</span>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="ml-1">{listing.rating}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button variant="outline">查看更多房源</Button>
        </div>
      </section>

      {/* 特色城市 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">热门城市</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["北京", "上海", "深圳", "成都"].map((city) => (
            <div key={city} className="relative h-40 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={`/api/placeholder/400/200`}
                alt={city}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{city}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 服务特点 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">为什么选择我们</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">精选房源</h3>
            <p className="text-gray-600">每处房源均经过严格审核，确保品质与安全</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="2" x2="9" y2="4"></line>
                <line x1="15" y1="2" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="22"></line>
                <line x1="15" y1="20" x2="15" y2="22"></line>
                <line x1="20" y1="9" x2="22" y2="9"></line>
                <line x1="20" y1="14" x2="22" y2="14"></line>
                <line x1="2" y1="9" x2="4" y2="9"></line>
                <line x1="2" y1="14" x2="4" y2="14"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">简便预订</h3>
            <p className="text-gray-600">轻松完成全流程在线预订，无需繁琐手续</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.8 11.3 2 22l10.7-3.79"></path>
                <path d="M4 3h.01"></path>
                <path d="M22 8h.01"></path>
                <path d="M15 2h.01"></path>
                <path d="M22 20h.01"></path>
                <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
                <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
                <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
                <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">全天候服务</h3>
            <p className="text-gray-600">24小时客户支持，解决您旅途中的任何问题</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;