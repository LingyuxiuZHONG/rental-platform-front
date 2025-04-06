import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const BookingManagement = () => {
    const [date, setDate] = useState(null);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>预订日历</CardTitle>
              <CardDescription>查看和管理预订</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto"
              />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>即将到来的预订</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 这里是即将到来的预订内容 */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium">赵先生</p>
                <p className="text-sm text-gray-600">海景公寓</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>2025-03-25</span>
                  <span>～</span>
                  <span>2025-03-30</span>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium">刘女士</p>
                <p className="text-sm text-gray-600">市中心豪华套房</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>2025-04-01</span>
                  <span>～</span>
                  <span>2025-04-10</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default BookingManagement;