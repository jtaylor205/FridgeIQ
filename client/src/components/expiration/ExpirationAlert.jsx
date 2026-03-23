import { expirationLabel } from '../../utils/dateHelpers';
import styles from './ExpirationAlert.module.css';

export default function ExpirationAlert({ item }) {
  const label = expirationLabel(item.expirationDate);
  const isExpired = new Date(item.expirationDate) < new Date();

  return (
    <div className={`${styles.alert} ${isExpired ? styles.expired : styles.expiring}`}>
      <div className={styles.icon}>
        {item.category === 'dairy' ? '🥛' : item.category === 'meat' ? '🥩' : item.category === 'produce' ? '🥦' : '🍽️'}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.meta}>
          {item.quantity?.amount} {item.quantity?.unit} · {item.category}
        </div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}
