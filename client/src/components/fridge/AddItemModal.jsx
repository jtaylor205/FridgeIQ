import { useRef, useState } from 'react';
import { useFridge } from '../../context/FridgeContext';

const SHELVES = ['top', 'middle', 'bottom', 'drawer', 'door'];
const CATEGORIES = ['dairy', 'meat', 'produce', 'grains', 'beverages', 'condiments', 'frozen', 'other'];

const defaultForm = {
  name: '',
  brand: '',
  quantity: { amount: 1, unit: 'item' },
  expirationDate: '',
  shelf: 'middle',
  category: 'other',
  isShared: false,
};

const formatDateForInput = (value) => {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeExpirationDateForSave = (value) => {
  if (!value) return null;
  return `${value}T12:00:00.000Z`;
};

const createInitialForm = ({ initialShelf, prefill, itemToEdit }) => {
  if (itemToEdit) {
    return {
      ...defaultForm,
      ...itemToEdit,
      quantity: {
        ...defaultForm.quantity,
        ...itemToEdit.quantity,
      },
      expirationDate: formatDateForInput(itemToEdit.expirationDate),
    };
  }

  if (prefill) {
    return {
      ...defaultForm,
      ...prefill,
      shelf: initialShelf,
      quantity: {
        ...defaultForm.quantity,
        ...prefill.quantity,
      },
      expirationDate: formatDateForInput(prefill.expirationDate),
    };
  }

  return {
    ...defaultForm,
    shelf: initialShelf,
  };
};

export default function AddItemModal({ initialShelf = 'middle', onClose, prefill = null, itemToEdit = null, onSaved }) {
  const { addItem, updateItem } = useFridge();
  const [form, setForm] = useState(() => createInitialForm({ initialShelf, prefill, itemToEdit }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = Boolean(itemToEdit);
  const expirationDateRef = useRef(null);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openDatePicker = () => {
    if (!expirationDateRef.current) return;

    if (typeof expirationDateRef.current.showPicker === 'function') {
      expirationDateRef.current.showPicker();
      return;
    }

    expirationDateRef.current.focus();
    expirationDateRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');

    setLoading(true);
    try {
      const payload = {
        ...form,
        expirationDate: normalizeExpirationDateForSave(form.expirationDate),
      };

      const savedItem = isEditMode
        ? await updateItem(itemToEdit._id, payload)
        : await addItem(payload);

      onSaved?.(savedItem);
      onClose();
    } catch {
      setError(isEditMode ? 'Failed to update item. Try again.' : 'Failed to add item. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Item' : 'Add Item'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">x</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Greek Yogurt" />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input value={form.brand || ''} onChange={(e) => set('brand', e.target.value)} placeholder="Optional" />
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.quantity.amount}
                onChange={(e) => set('quantity', { ...form.quantity, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input
                value={form.quantity.unit}
                onChange={(e) => set('quantity', { ...form.quantity, unit: e.target.value })}
                placeholder="item, oz, lbs..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expiration Date</label>
            <div className="modal-date-field">
              <input
                ref={expirationDateRef}
                type="date"
                value={form.expirationDate}
                onChange={(e) => set('expirationDate', e.target.value)}
              />
              <button type="button" className="btn btn-secondary modal-date-trigger" onClick={openDatePicker}>
                Pick Date
              </button>
            </div>
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label>Shelf</label>
              <select value={form.shelf} onChange={(e) => set('shelf', e.target.value)}>
                {SHELVES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <label className="modal-check-label">
            <input type="checkbox" checked={form.isShared} onChange={(e) => set('isShared', e.target.checked)} />
            Mark as shared with roommates
          </label>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
