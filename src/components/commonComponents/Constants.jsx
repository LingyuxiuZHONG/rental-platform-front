

export const ROLE_TYPE = {
    GUEST: '1',
    HOST: '2',
    ADMIN: '3'
  };


export const API_BASE_URL = "http://localhost:10010/upload/"; 

export const AMAP_KEY = "6a54af5659068bff403406a0e4836b69";


export const BOOKING_STATUS = {
  PENDING: 0,
  PAYING: 1,
  PAID: 2,
  CANCELLED: 3,
  COMPLETED: 4
};

// 预订状态映射函数
export const mapStatusToDetails = (status) => {
  switch (status) {
    case BOOKING_STATUS.PENDING: 
      return { string: 'pending', label: '待支付', variant: 'outline' };
    case BOOKING_STATUS.PAYING: 
      return { string: 'paying', label: '支付中', variant: 'secondary' };
    case BOOKING_STATUS.PAID: 
      return { string: 'paid', label: '已付款', variant: 'default' };
    case BOOKING_STATUS.CANCELLED: 
      return { string: 'cancelled', label: '已取消', variant: 'destructive' };
    case BOOKING_STATUS.COMPLETED: 
      return { string: 'completed', label: '已完成', variant: 'default' };
    default:
      return { string: 'unknown', label: '未知状态', variant: 'outline' };
  }
};

// 根据字符串状态获取中文标签 (用于筛选条件显示)
export const getStatusLabel = (string) => {
  switch(string) {
    case 'pending': return '未支付';
    case 'paying': return '支付中';
    case 'paid': return '已付款';
    case 'completed': return '已完成';
    case 'cancelled': return '已取消';
    default: return '';
  }
};

// 反向映射：从字符串状态到数字状态码
export const getStatusCode = (statusString) => {
  switch(statusString) {
    case 'pending': return BOOKING_STATUS.PENDING;
    case 'paying': return BOOKING_STATUS.PAYING;
    case 'paid': return BOOKING_STATUS.PAID;
    case 'cancelled': return BOOKING_STATUS.CANCELLED;
    case 'completed': return BOOKING_STATUS.COMPLETED;
    default: return -1; // 未知状态
  }
};

// 取消政策类型
export const CANCEL_POLICY = {
  FLEXIBLE: 0,
  MODERATE: 1,
  STRICT: 2
};

// 取消政策标签
export const POLICY_LABELS = {
  [CANCEL_POLICY.FLEXIBLE]: '灵活政策',
  [CANCEL_POLICY.MODERATE]: '中等政策',
  [CANCEL_POLICY.STRICT]: '严格政策'
};

// 房主取消预订的原因
export const HOST_CANCEL_REASONS = [
  { value: 'dates unavailable', label: '日期不可用' },
  { value: 'property not suitable', label: '房源不适合客人' },
  { value: 'other reason', label: '其他原因' }
];

// 房客取消预订的原因
export const GUEST_CANCEL_REASONS = [
  { value: 'change of plans', label: '行程变更' },
  { value: 'found alternative', label: '找到其他住宿' },
  { value: 'accommodation not suitable', label: '住宿不符合预期' },
  { value: 'other reason', label: '其他原因' }
];