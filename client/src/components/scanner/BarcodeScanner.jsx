import { useState } from 'react';
import { barcodeService } from '../../services/barcodeService';
import ScanResults from './ScanResults';
import styles from './BarcodeScanner.module.css';

// TODO: replace camera placeholder with live scanning via @zxing/browser

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
    <div className={styles.wrapper}>
      <div className={styles.cameraPlaceholder}>
        {/* TODO: Replace with live camera feed using @zxing/browser */}
        <div className={styles.cameraIcon}>📷</div>
        <p>Camera barcode scanning</p>
        <span>Coming soon — connect webcam via @zxing/browser</span>
      </div>

      <div className={styles.manualFallback}>
        <p className={styles.orDivider}>or enter barcode manually</p>
        <form onSubmit={handleLookup} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. 0737628064502"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Looking up…' : 'Look Up'}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.results}>
        <ScanResults result={result} onAddToFridge={onAddToFridge} />
      </div>
    </div>
  );
}
