export const formatDate = (date) => {
  if (!date) return 'No date';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const daysUntilExpiration = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const expirationStatus = (date) => {
  const days = daysUntilExpiration(date);
  if (days === null) return null;
  if (days < 0) return 'expired';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return 'soon';
  return 'ok';
};

export const expirationLabel = (date) => {
  const days = daysUntilExpiration(date);
  if (days === null) return '';
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  if (days <= 7) return `Expires in ${days} days`;
  return `Exp: ${formatDate(date)}`;
};
