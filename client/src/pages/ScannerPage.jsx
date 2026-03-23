import { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import ImageUploader from '../components/scanner/ImageUploader';
import ScanResults from '../components/scanner/ScanResults';
import BarcodeScanner from '../components/scanner/BarcodeScanner';
import AddItemModal from '../components/fridge/AddItemModal';
import { scannerService } from '../services/scannerService';
import styles from './ScannerPage.module.css';

const TABS = ['Label Scan', 'Barcode Scan'];

export default function ScannerPage() {
  const { addItem } = useFridge();
  const [activeTab, setActiveTab] = useState('Label Scan');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [addModal, setAddModal] = useState(null);

  const handleFileSelect = (f) => {
    setFile(f);
    setResult(null);
    setError('');
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError('');
    try {
      const data = await scannerService.scanImage(file);
      setResult(data);
    } catch {
      setError('Scan failed. Please try a clearer image.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Food Scanner</h1>
        <p>Upload a photo or scan a barcode to add items to your fridge</p>
      </div>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Label Scan' && (
        <div className={styles.layout}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Upload Food Image</h2>
            <p className={styles.panelSub}>Drag and drop or click to upload</p>
            <ImageUploader onFileSelect={handleFileSelect} />
            {file && (
              <button className={`btn btn-primary ${styles.scanBtn}`} onClick={handleScan} disabled={scanning}>
                {scanning ? 'Scanning…' : 'Scan Image'}
              </button>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Scan Results</h2>
            <p className={styles.panelSub}>{result ? 'Food item identified' : 'Upload an image to see results'}</p>
            <ScanResults result={result} onAddToFridge={setAddModal} />
          </div>
        </div>
      )}

      {activeTab === 'Barcode Scan' && (
        <div className={styles.barcode}>
          <div className={styles.panel}>
            <BarcodeScanner onAddToFridge={setAddModal} />
          </div>
        </div>
      )}

      {addModal && (
        <AddItemModal prefill={addModal} onClose={() => setAddModal(null)} />
      )}
    </div>
  );
}
