import { expirationStatus, expirationLabel } from '../../utils/dateHelpers';
import styles from './FridgeItem.module.css';

export default function FridgeItem({ item, onClick }) {
  const status = expirationStatus(item.expirationDate);

  return (
    <div className={`${styles.card} ${status === 'expired' ? styles.expired : ''}`} onClick={onClick}>
      <div className={styles.imageWrapper}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>{item.name[0]}</div>
        )}
        <div className={styles.badges}>
          {item.addedBy?.name && (
            <span className={`badge badge-green ${styles.ownerBadge}`}>{item.addedBy.name}</span>
          )}
          {(status === 'expired' || status === 'today' || status === 'tomorrow') && (
            <span className={`badge badge-red ${styles.expiryBadge}`}>SOON</span>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        {item.quantity && (
          <div className={styles.meta}>
            {item.quantity.amount} {item.quantity.unit}
          </div>
        )}
        {item.nutrition?.calories && (
          <div className={styles.meta}>{item.nutrition.calories} kcal</div>
        )}
        {item.expirationDate && (
          <div className={`${styles.expiry} ${styles[status]}`}>
            {expirationLabel(item.expirationDate)}
          </div>
        )}
        {item.nutrition?.vitamins?.length > 0 && (
          <div className={styles.meta}>{item.nutrition.vitamins.join(', ')}</div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.useBtn} onClick={(e) => { e.stopPropagation(); }}>
          Use
        </button>
      </div>
    </div>
  );
}
