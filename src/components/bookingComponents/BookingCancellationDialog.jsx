import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '@/components/commonComponents/AuthProvider';

// 房主取消预订的原因
const HostCancelReasons = [
  { value: 'dates unavailable', label: '日期不可用' },
  { value: 'property not suitable', label: '房源不适合客人' },
  { value: 'other reason', label: '其他原因' }
];

// 房客取消预订的原因
const GuestCancelReasons = [
  { value: 'change of plans', label: '行程变更' },
  { value: 'found alternative', label: '找到其他住宿' },
  { value: 'accommodation not suitable', label: '住宿不符合预期' },
  { value: 'other reason', label: '其他原因' }
];

// 政策类型映射
const POLICY_LABELS = {
  0: '灵活政策',
  1: '中等政策', 
  2: '严格政策'
};

const BookingCancellationDialog = ({ 
  isOpen, 
  onClose, 
  booking, 
  isHost, 
  onConfirmCancel,
  cancelPolicy
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReasonText, setOtherReasonText] = useState('');
  const { user } = useAuth();

  // 计算取消政策细节
  const calculateCancellationPolicy = () => {
    const { startDate, totalAmount } = booking;
    const now = new Date();
    const checkIn = new Date(startDate);
    const daysDifference = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));

    let cancelDetails = {
      isFree: false,
      refundPercentage: 0,
      refundAmount: 0,          
      cancellationFee: 0,       
      policyType: cancelPolicy,
      cancelReason: ''
    };

    const policy = Number(cancelPolicy);
    switch(policy) {
      case 0: // flexible
        if (daysDifference > 1) {
          cancelDetails.isFree = true;
          cancelDetails.refundPercentage = 100;
          cancelDetails.refundAmount = totalAmount;   // 修改：全额退款
          cancelDetails.cancellationFee = 0;         // 无取消费用
        } else {
          cancelDetails.refundPercentage = 0;
          cancelDetails.refundAmount = 0;            // 无退款
          cancelDetails.cancellationFee = totalAmount; // 全额取消费用
        }
        break;
      case 1: // moderate
        if (daysDifference > 7) {
          cancelDetails.isFree = true;
          cancelDetails.refundPercentage = 100;
          cancelDetails.refundAmount = totalAmount;   // 修改：全额退款
          cancelDetails.cancellationFee = 0;         // 无取消费用
        } else {
          cancelDetails.refundPercentage = 50;
          cancelDetails.refundAmount = totalAmount * 0.5;  // 退还50%
          cancelDetails.cancellationFee = totalAmount * 0.5; // 50%取消费用
        }
        break;
      case 2: // strict
        if (daysDifference > 7) {
          cancelDetails.refundPercentage = 20;
          cancelDetails.refundAmount = totalAmount * 0.2;  // 退还20%
          cancelDetails.cancellationFee = totalAmount * 0.8; // 80%取消费用
        } else {
          cancelDetails.refundPercentage = 0;
          cancelDetails.refundAmount = 0;              // 无退款
          cancelDetails.cancellationFee = totalAmount;  // 全额取消费用
        }
        break;
    }

    return cancelDetails;
  };

  const cancelDetails = calculateCancellationPolicy();

  const handleCancel = () => {
    // 如果选择了"其他原因"，合并原因和详细文本
    const finalReason = selectedReason === 'other reason' 
      ? `other reason: ${otherReasonText}` 
      : selectedReason;
    
    if (onConfirmCancel) {
      onConfirmCancel({
        cancelReason: finalReason,
        refundAmount: cancelDetails.refundAmount,  // 这里传递的是退还的金额
        cancelledBy: user.id
      });
    }
    onClose();
  };

  // 渲染"其他原因"的文本输入
  const renderOtherReasonInput = () => {
    return selectedReason === 'other reason' ? (
      <div className="mt-4">
        <Input 
          placeholder="请详细说明其他原因" 
          value={otherReasonText}
          onChange={(e) => setOtherReasonText(e.target.value)}
          className="w-full"
        />
      </div>
    ) : null;
  };

  const renderHostCancellation = () => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          拒绝预订
        </DialogTitle>
        <DialogDescription>
          请选择拒绝预订的原因
        </DialogDescription>
      </DialogHeader>
      
      <RadioGroup 
        value={selectedReason} 
        onValueChange={setSelectedReason} 
        className="space-y-2"
      >
        {HostCancelReasons.map((cancelReason) => (
          <div key={cancelReason.value} className="flex items-center space-x-2">
            <RadioGroupItem value={cancelReason.value} id={cancelReason.value} />
            <Label htmlFor={cancelReason.value}>{cancelReason.label}</Label>
          </div>
        ))}
      </RadioGroup>

      {renderOtherReasonInput()}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button 
          variant="destructive" 
          onClick={handleCancel}
          disabled={!selectedReason || (selectedReason === 'other reason' && !otherReasonText.trim())}
        >
          确认拒绝
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  // 房客取消预订的渲染
  const renderGuestCancellation = () => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          取消预订
        </DialogTitle>
      </DialogHeader>

      {/* 政策详情区域 */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <Info className="mr-2 text-blue-500" size={20} />
          <span className="font-semibold text-gray-700">取消政策说明</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <p>
            当前预订政策：
            <span className="font-bold text-blue-600">
              {POLICY_LABELS[cancelPolicy]}
            </span>
          </p>
          
          <div className="flex justify-between items-center">
            <span>退还金额：</span>
            <span className="font-bold text-green-600">
              {cancelDetails.refundPercentage}% (¥{cancelDetails.refundAmount.toFixed(2)})
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>取消费用：</span>
            <span className="font-bold text-red-600">
              ¥{cancelDetails.cancellationFee.toFixed(2)}
            </span>
          </div>
          
          {cancelDetails.isFree && (
            <div className="text-green-600 font-semibold mt-2">
              ✓ 本次取消免费
            </div>
          )}
          
          {!cancelDetails.isFree && (
            <div className="text-red-600 font-semibold mt-2">
              ！将收取取消费用
            </div>
          )}
        </div>
      </div>

      {/* 取消原因 */}
      <RadioGroup 
        value={selectedReason} 
        onValueChange={setSelectedReason} 
        className="space-y-2"
      >
        {GuestCancelReasons.map((cancelReason) => (
          <div key={cancelReason.value} className="flex items-center space-x-2">
            <RadioGroupItem value={cancelReason.value} id={cancelReason.value} />
            <Label htmlFor={cancelReason.value}>{cancelReason.label}</Label>
          </div>
        ))}
      </RadioGroup>

      {renderOtherReasonInput()}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button 
          variant="destructive" 
          onClick={handleCancel}
          disabled={!selectedReason || (selectedReason === 'other reason' && !otherReasonText.trim())}
        >
          {cancelDetails.isFree ? '确认免费取消' : `确认并支付取消费用 (¥${cancelDetails.cancellationFee.toFixed(2)})`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isHost 
        ? renderHostCancellation() 
        : renderGuestCancellation()
      }
    </Dialog>
  );
};

export default BookingCancellationDialog;