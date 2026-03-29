import { expirationStatus, expirationLabel } from '../../utils/dateHelpers';

export default function FridgeItem({ item, onClick }) {
  const status = expirationStatus(item.expirationDate);

  return (
    <div
      className={`fridge-card${status === 'expired' ? ' fridge-card-expired' : ''}`}
      onClick={onClick}
    >
      <div className="fridge-image-wrap">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="fridge-image" />
        ) : (
          <div className="fridge-placeholder">{item.name[0]}</div>
        )}
        <div className="fridge-badges">
          {(status === 'expired' || status === 'today') && (
            <span className="badge badge-red">Expires soon</span>
          )}
          {status === 'tomorrow' && (
            <span className="badge badge-amber">Tomorrow</span>
          )}
          {item.isShared && (
            <span className="badge badge-neutral">Shared</span>
          )}
        </div>
      </div>

      <div className="fridge-info">
        <div className="fridge-name">{item.name}</div>
        {item.quantity && (
          <div className="fridge-meta">
            {item.quantity.amount} {item.quantity.unit}
            {item.nutrition?.calories ? ` · ${item.nutrition.calories} kcal` : ''}
          </div>
        )}
        {item.expirationDate && (
          <div className={`fridge-expiry fridge-expiry-${status}`}>
            {expirationLabel(item.expirationDate)}
          </div>
        )}
      </div>
    </div>
  );
}
