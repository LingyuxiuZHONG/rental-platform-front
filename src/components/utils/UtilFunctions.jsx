export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};


export const calculateDays = (startD, endD) => {
  const startDate = new Date(startD);
  const endDate = new Date(endD);
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
};