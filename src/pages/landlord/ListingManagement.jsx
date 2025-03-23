import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';



const ListingManagement = ({ listings }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>我的房源</CardTitle>
        <CardDescription>管理您的所有房源</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">房源</th>
                <th className="text-left p-2">类型</th>
                <th className="text-left p-2">地址</th>
                <th className="text-left p-2">卧室/浴室</th>
                <th className="text-left p-2">状态</th>
                <th className="text-left p-2">租户</th>
                <th className="text-left p-2">租约到期</th>
                <th className="text-left p-2">月收入</th>
                <th className="text-left p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="flex items-center">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].preview}
                          alt={listing.name}
                          className="w-10 h-10 rounded-md object-cover mr-2"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center mr-2">
                          <Home className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      {listing.name}
                    </div>
                  </td>
                  <td className="p-2">{listing.type || '-'}</td>
                  <td className="p-2">{listing.address}</td>
                  <td className="p-2">{listing.bedrooms}/{listing.bathrooms}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${listing.status === '已租' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-2">{listing.tenant}</td>
                  <td className="p-2">{listing.endDate}</td>
                  <td className="p-2">¥{listing.income}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">编辑</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">删除</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingManagement;
