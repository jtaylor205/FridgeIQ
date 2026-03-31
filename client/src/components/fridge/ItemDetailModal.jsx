import { useState } from 'react';
import { useFridge } from '../../context/FridgeContext';
import { expirationLabel, expirationStatus } from '../../utils/dateHelpers';

export default function ItemDetailModal({ item, onClose, onEdit }) {
  const { deleteItem } = useFridge();
  const status = expirationStatus(item.expirationDate);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteItem(item._id);
      onClose();
    } catch {
      setDeleteError('Failed to remove item. Try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box-narrow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-detail">
          <div>
            <h2>{item.name}</h2>
            {item.brand && <p className="modal-brand">{item.brand}</p>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">x</button>
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

        {deleteError && <p className="modal-error">{deleteError}</p>}

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

        {confirmingDelete && (
          <div className="modal-confirm-danger">
            <p>Remove "{item.name}" from your fridge?</p>
            <span>This action cannot be undone.</span>
            <div className="modal-confirm-danger-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmingDelete(false)} disabled={isDeleting}>
                Keep Item
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        )}

        <div className="modal-footer-detail">
          <div className="modal-footer-detail-actions">
            <button className="btn btn-secondary" onClick={() => onEdit?.(item)} disabled={isDeleting}>
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setDeleteError('');
                setConfirmingDelete(true);
              }}
              disabled={confirmingDelete || isDeleting}
            >
              Remove
            </button>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
