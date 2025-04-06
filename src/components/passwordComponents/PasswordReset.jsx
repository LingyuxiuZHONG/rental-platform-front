import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const PasswordReset = ({ isVisible, onClose, onReset }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleReset = async (e) => {
    e.preventDefault();  // 阻止表单提交

    if (validateForm()) {
      setIsLoading(true);
      try {
        const resetData = { email, password };
        await onReset(resetData); // 调用父组件的 onReset 方法进行密码重置
        
        setSuccessMessage('密码重置成功！');  // 成功提示信息
        resetForm();  // 重置表单
        setTimeout(() => {
          onClose();  // 延迟关闭弹窗，给用户时间看到成功提示
          setSuccessMessage('');
        }, 1000); // 设置一个1秒延迟后关闭弹窗
      } catch (error) {
        setServerError(error.message || '重置密码时发生错误');
        resetForm();  // 清空表单
      } finally {
        setIsLoading(false);  // 无论成功还是失败都停止加载
      }
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
          <DialogDescription>
            输入邮箱和新密码
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleReset}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                邮箱
              </Label>
              <Input 
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                新密码
              </Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                确认密码
              </Label>
              <Input 
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm text-center">
                {passwordError}
              </div>
            )}
            {serverError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            {successMessage && successMessage !== '' && (
              <Alert variant="success" className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
            <Button 
              type="button" // 将“确认重置”按钮的 type 改为 button
              onClick={handleReset} // 触发重置密码的逻辑
              disabled={isLoading}
            >
              {isLoading ? '重置中...' : '确认重置'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordReset;
