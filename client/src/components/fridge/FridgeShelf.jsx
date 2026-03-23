import FridgeItem from './FridgeItem';
import styles from './FridgeShelf.module.css';

export default function FridgeShelf({ label, items, onItemClick, onAddClick }) {
  return (
    <section className={styles.shelf}>
      <h2 className={styles.label}>{label}</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <FridgeItem key={item._id} item={item} onClick={() => onItemClick(item)} />
        ))}
        <button className={styles.addSlot} onClick={() => onAddClick(label.toLowerCase())}>
          <span className={styles.plus}>+</span>
          <span>Add to {label}</span>
        </button>
      </div>
    </section>
  );
}
