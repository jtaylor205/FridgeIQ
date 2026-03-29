import FridgeItem from './FridgeItem';

export default function FridgeShelf({ label, items, onItemClick, onAddClick }) {
  return (
    <section className="shelf-section">
      <div className="shelf-header">
        <span className="shelf-label">{label}</span>
        {items.length > 0 && (
          <span className="shelf-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        )}
      </div>
      <div className="shelf-grid">
        {items.map((item) => (
          <FridgeItem key={item._id} item={item} onClick={() => onItemClick(item)} />
        ))}
        <button className="shelf-add-slot" onClick={() => onAddClick(label.toLowerCase())}>
          <span className="shelf-plus">+</span>
          <span>Add item</span>
        </button>
      </div>
    </section>
  );
}
