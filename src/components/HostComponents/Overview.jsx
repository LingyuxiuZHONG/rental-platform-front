import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Home, MessageSquare, } from 'lucide-react';


const Overview = ({ listings, messages }) => {
  // 假设从服务器获取到这些数据
  const [totalIncome, setTotalIncome] = useState(10000);
  const [occupancyRate, setOccupancyRate] = useState(85);
  

//   useEffect(() => {
//     // 假设在这里获取数据
//   }, []);

return (
    <div className="space-y-6">
      {/* 总收入 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">总收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">¥{totalIncome}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">本月收入</p>
          </CardContent>
        </Card>

        {/* 入住率 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">入住率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Home className="mr-2 h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</span>
            </div>
            <Progress value={occupancyRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* 未读消息 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">未读消息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">{messages.filter(m => !m.read).length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">共 {messages.length} 条消息</p>
          </CardContent>
        </Card>
      </div>

      {/* 最近交易 */}
      {/* <Card>
        <CardHeader>
          <CardTitle>最近交易</CardTitle>
          <p className="text-sm text-gray-500">查看最近的租金收入</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {listings.filter(p => p.status === '已租').map(listing => (
              <div key={listing.id} className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">{listing.name}</p>
                  <p className="text-sm text-gray-500">{listing.tenant}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+¥{listing.income}</p>
                  <p className="text-sm text-gray-500">月租</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Overview;
