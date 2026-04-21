import { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import ImageUploader from '../components/scanner/ImageUploader';
import ScanResults from '../components/scanner/ScanResults';
import BarcodeScanner from '../components/scanner/BarcodeScanner';
import AddItemModal from '../components/fridge/AddItemModal';
import { scannerService } from '../services/scannerService';
import { barcodeService } from '../services/barcodeService';

const TABS = ['Label Scan', 'Barcode Scan'];

export default function ScannerPage() {
  const { addItem } = useFridge();
  const [activeTab, setActiveTab] = useState('Label Scan');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [manualUpc, setManualUpc] = useState('');
  const [addModal, setAddModal] = useState(null);

  const handleFileSelect = (f) => {
    setFile(f);
    setResult(null);
    setError('');
    setManualUpc('');
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError('');
    setManualUpc(''); // keep just in case logic needs it
    try {
      const data = await scannerService.scanImage(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Scan failed. Please try a clearer image.');
    } finally {
      setScanning(false);
    }
  };

  const handleManualLookup = async () => {
    if (!manualUpc.trim()) return;
    setScanning(true);
    setError('');
    try {
      const data = await barcodeService.lookup(manualUpc.trim());
      setResult(data);
      setManualUpc('');
    } catch (err) {
      setError(err.message || 'Product not found. Try a different barcode.');
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

      <div className="scanner-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`scanner-tab${activeTab === tab ? ' scanner-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Label Scan' && (
        <div className="scanner-layout">
          <div className="scanner-panel">
            <h2 className="scanner-panel-title">Upload Food Image</h2>
            <p className="scanner-panel-sub">Drag and drop or click to upload</p>
            <ImageUploader onFileSelect={handleFileSelect} />
            {file && (
              <button className="btn btn-primary scanner-scan-btn" onClick={handleScan} disabled={scanning}>
                {scanning ? 'Scanning…' : 'Scan Image'}
              </button>
            )}
            {error && <p className="scanner-error">{error}</p>}
          </div>

          <div className="scanner-panel">
            <h2 className="scanner-panel-title">Scan Results</h2>
            <p className="scanner-panel-sub">{result ? 'Food item identified' : 'Upload an image to see results'}</p>
            <ScanResults result={result} onAddToFridge={setAddModal} />
          </div>
        </div>
      )}

      {activeTab === 'Barcode Scan' && (
        <div className="scanner-barcode">
          <div className="scanner-panel">
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
