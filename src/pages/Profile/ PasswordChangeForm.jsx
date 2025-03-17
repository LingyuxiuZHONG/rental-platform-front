import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { verifyPassword, updatePassword } from '@/services/userApi'; // 确保导入正确的API函数
import { useAuth } from '@/components/common/AuthProvider'; // 导入Auth上下文

const PasswordChangeForm = ({ onPasswordChangeSuccess }) => {
  const { user } = useAuth(); // 从Auth上下文获取用户信息
  const userId = user?.id; // 获取用户ID
  
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyPassword = async () => {
    if (!currentPassword) {
      setError('密码不能为空');
      return;
    }
    setIsVerifying(false);
    setError('');
    
    try {
      
      await verifyPassword(userId, currentPassword);
      
      setStep(2);
    } catch (err) {
      // 处理验证失败的情况
      setError('当前密码不正确，请重试');
    } 
  };

  const handleUpdatePassword = async () => {
    // 密码验证
    if (!newPassword || !confirmPassword) {
      setError('请填写所有密码字段');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    // 取消注释下面的代码以启用密码长度验证
    // if (newPassword.length < 8) {
    //   setError('新密码长度至少为8个字符');
    //   return;
    // }
    
    setIsVerifying(true);
    setError('');
    
    try {
      await updatePassword(userId, currentPassword, newPassword);
        
      // 更新成功
      setIsSuccess(true);
        
      // 3秒后重置表单
      setTimeout(() => {
        setStep(1);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsSuccess(false);
      }, 3000);
        
      // 显示成功提示消息
      toast.success("密码已成功更新");

      onPasswordChangeSuccess();
    } catch (err) {
      // 处理更新失败的情况
      console.error('密码更新失败:', err);
      setError(err.message || '密码更新失败，请重试');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  if (isSuccess) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center">
        <CheckCircle className="mr-2 h-5 w-5" />
        <span>密码更新成功！</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {step === 1 ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">当前密码</Label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="请输入当前密码"
            />
          </div>
          
          {error && (
            <div className="p-2 text-red-500 flex items-center text-sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <Button 
            onClick={handleVerifyPassword} 
            disabled={isVerifying}
          >
            {isVerifying ? '验证中...' : '验证密码'}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input 
              id="newPassword" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="请输入新密码"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入新密码"
            />
          </div>
          
          {error && (
            <div className="p-2 text-red-500 flex items-center text-sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              返回
            </Button>
            <Button 
              onClick={handleUpdatePassword} 
              disabled={isVerifying}
            >
              {isVerifying ? '更新中...' : '更新密码'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordChangeForm;