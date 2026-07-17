export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '0.00';
  return Number(num).toFixed(decimals);
};

export const formatPercentage = (num) => {
  if (num === null || num === undefined) return '0.0%';
  return `${(Number(num) * 100).toFixed(1)}%`;
};
