import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ProfilePreferencesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>偏好设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">通知设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">邮件通知</p>
                <p className="text-sm text-gray-500">接收预订更新和促销信息</p>
              </div>
              <Button variant="outline">已启用</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">短信通知</p>
                <p className="text-sm text-gray-500">获取关于您预订的提醒</p>
              </div>
              <Button variant="outline">已禁用</Button>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">语言和货币</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">语言</Label>
              <select
                id="language"
                className="w-full p-2 border rounded-md"
              >
                <option value="zh">中文</option>
                <option value="en">英文</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">货币</Label>
              <select
                id="currency"
                className="w-full p-2 border rounded-md"
              >
                <option value="cny">人民币 (¥)</option>
                <option value="usd">美元 ($)</option>
                <option value="eur">欧元 (€)</option>
                <option value="gbp">英镑 (£)</option>
                <option value="jpy">日元 (¥)</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreferencesTab;