import { expirationLabel } from '../../utils/dateHelpers';

const CATEGORY_EMOJI = {
  dairy: '🥛',
  meat: '🥩',
  produce: '🥦',
  grains: '🌾',
  beverages: '🧃',
  condiments: '🫙',
  frozen: '🧊',
  other: '🍽️',
};

export default function ExpirationAlert({ item }) {
  const label = expirationLabel(item.expirationDate);
  const isExpired = new Date(item.expirationDate) < new Date();

  return (
    <div className={`exp-alert ${isExpired ? 'exp-alert-expired' : 'exp-alert-expiring'}`}>
      <div className="exp-icon-wrap">
        {CATEGORY_EMOJI[item.category] ?? '🍽️'}
      </div>
      <div className="exp-info">
        <div className="exp-name">{item.name}</div>
        <div className="exp-meta">
          {item.quantity?.amount} {item.quantity?.unit} · {item.category}
        </div>
      </div>
      <span className="exp-label">{label}</span>
    </div>
  );
}
