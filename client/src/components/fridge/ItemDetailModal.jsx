import { useFridge } from '../../context/FridgeContext';
import { expirationLabel, expirationStatus, formatDate } from '../../utils/dateHelpers';

export default function ItemDetailModal({ item, onClose }) {
  const { deleteItem, updateItem } = useFridge();
  const status = expirationStatus(item.expirationDate);

  const handleDelete = async () => {
    if (!confirm(`Remove "${item.name}" from your fridge?`)) return;
    await deleteItem(item._id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box-narrow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-detail">
          <div>
            <h2>{item.name}</h2>
            {item.brand && <p className="modal-brand">{item.brand}</p>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="modal-image" />}

        <div className="modal-meta">
          <span className="badge badge-green">{item.category}</span>
          <span className="badge badge-green">{item.shelf} shelf</span>
          {item.isShared && <span className="badge badge-green">Shared</span>}
        </div>

        {item.expirationDate && (
          <div className={`modal-expiry modal-expiry-${status}`}>
            {expirationLabel(item.expirationDate)}
          </div>
        )}

        <hr className="divider" />

        {item.nutrition && (
          <div>
            <h3 className="modal-section-title">Nutrition</h3>
            <div className="modal-nutrition-grid">
              {item.nutrition.calories && <div className="modal-stat"><span>{item.nutrition.calories}</span><label>Calories</label></div>}
              {item.nutrition.protein && <div className="modal-stat"><span>{item.nutrition.protein}g</span><label>Protein</label></div>}
              {item.nutrition.carbs && <div className="modal-stat"><span>{item.nutrition.carbs}g</span><label>Carbs</label></div>}
              {item.nutrition.fat && <div className="modal-stat"><span>{item.nutrition.fat}g</span><label>Fat</label></div>}
            </div>
          </div>
        )}

        <div className="modal-footer-detail">
          <button className="btn btn-danger" onClick={handleDelete}>Remove</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
