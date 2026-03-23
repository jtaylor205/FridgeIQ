import { useState } from 'react';
import { useFridge } from '../../context/FridgeContext';
import styles from './AddItemModal.module.css';

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

export default function AddItemModal({ initialShelf = 'middle', onClose, prefill = null }) {
  const { addItem } = useFridge();
  const [form, setForm] = useState(prefill ? { ...defaultForm, ...prefill, shelf: initialShelf } : { ...defaultForm, shelf: initialShelf });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    setLoading(true);
    try {
      await addItem({
        ...form,
        expirationDate: form.expirationDate || null,
      });
      onClose();
    } catch {
      setError('Failed to add item. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add Item</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Greek Yogurt" />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Optional" />
          </div>

          <div className={styles.row}>
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
                placeholder="item, oz, lbs…"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expiration Date</label>
            <input type="date" value={form.expirationDate} onChange={(e) => set('expirationDate', e.target.value)} />
          </div>

          <div className={styles.row}>
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

          <label className={styles.checkLabel}>
            <input type="checkbox" checked={form.isShared} onChange={(e) => set('isShared', e.target.checked)} />
            Mark as shared with roommates
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding…' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
