export const formatCurrency = (num: number | undefined): string => {
  if (num) return (Math.round(num * 100) / 100).toFixed(2);
  else return '0.00';
};
