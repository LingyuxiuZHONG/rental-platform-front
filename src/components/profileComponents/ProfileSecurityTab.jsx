import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordChangeForm from './PasswordChangeForm';

const ProfileSecurityTab = ({ onPasswordChangeSuccess }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>安全设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">修改密码</h3>
          <PasswordChangeForm onPasswordChangeSuccess={onPasswordChangeSuccess} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSecurityTab;