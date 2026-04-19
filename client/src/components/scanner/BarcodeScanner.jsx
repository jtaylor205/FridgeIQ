import { useState } from 'react';
import { barcodeService } from '../../services/barcodeService';
import ScanResults from './ScanResults';

export default function BarcodeScanner({ onAddToFridge }) {
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await barcodeService.lookup(barcode.trim());
      setResult(data);
    } catch {
      setError('Product not found. Try a different barcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="barcode-wrapper">
      <div className="barcode-camera">
        <div className="barcode-camera-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <p>Camera barcode scanning</p>
        <span>Coming soon — live webcam via @zxing/browser</span>
      </div>

      <div className="barcode-manual">
        <p className="barcode-or-divider">or enter barcode manually</p>
        <form onSubmit={handleLookup} className="barcode-form">
          <input
            className="barcode-input"
            type="text"
            placeholder="e.g. 0737628064502"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Looking up…' : 'Look up'}
          </button>
        </form>
        {error && <p className="barcode-error">{error}</p>}
      </div>

      <div className="barcode-results">
        <ScanResults result={result} onAddToFridge={onAddToFridge} />
      </div>
    </div>
  );
}
