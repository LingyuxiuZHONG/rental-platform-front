import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';


const MessageCenter = ({ messages }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>消息中心</CardTitle>
          <CardDescription>查看租户的消息和请求</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${message.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <User className="h-10 w-10 p-2 rounded-full bg-gray-100 mr-3" />
                    <div>
                      <p className="font-medium">{message.from}</p>
                      <p className="text-sm text-gray-500">{message.listing}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{message.date}</span>
                </div>
                <p className="mt-3">{message.content}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">标记为已读</Button>
                  <Button size="sm">回复</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default MessageCenter;