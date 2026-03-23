import { useFridge } from '../../context/FridgeContext';
import { expirationLabel, expirationStatus, formatDate } from '../../utils/dateHelpers';
import styles from './ItemDetailModal.module.css';

export default function ItemDetailModal({ item, onClose }) {
  const { deleteItem, updateItem } = useFridge();
  const status = expirationStatus(item.expirationDate);

  const handleDelete = async () => {
    if (!confirm(`Remove "${item.name}" from your fridge?`)) return;
    await deleteItem(item._id);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2>{item.name}</h2>
            {item.brand && <p className={styles.brand}>{item.brand}</p>}
          </div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className={styles.image} />}

        <div className={styles.meta}>
          <span className="badge badge-green">{item.category}</span>
          <span className="badge badge-green">{item.shelf} shelf</span>
          {item.isShared && <span className="badge badge-green">Shared</span>}
        </div>

        {item.expirationDate && (
          <div className={`${styles.expiry} ${styles[status]}`}>
            {expirationLabel(item.expirationDate)}
          </div>
        )}

        <hr className="divider" />

        {item.nutrition && (
          <div className={styles.nutrition}>
            <h3 className={styles.sectionTitle}>Nutrition</h3>
            <div className={styles.nutritionGrid}>
              {item.nutrition.calories && <div className={styles.stat}><span>{item.nutrition.calories}</span><label>Calories</label></div>}
              {item.nutrition.protein && <div className={styles.stat}><span>{item.nutrition.protein}g</span><label>Protein</label></div>}
              {item.nutrition.carbs && <div className={styles.stat}><span>{item.nutrition.carbs}g</span><label>Carbs</label></div>}
              {item.nutrition.fat && <div className={styles.stat}><span>{item.nutrition.fat}g</span><label>Fat</label></div>}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <button className="btn btn-danger" onClick={handleDelete}>Remove</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
