import { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import { groceryService } from '../services/groceryService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateHelpers';
import styles from './GroceryImportPage.module.css';


export default function GroceryImportPage() {
  const { fetchFridge } = useFridge();
  const [connected, setConnected] = useState(false);
  const [orders, setOrders] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [selected, setSelected] = useState({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const loadOrders = async () => {
    const data = await groceryService.getOrders();
    setOrders(data);
  };

  const handleConnect = async () => {
    setConnecting(true);
    await groceryService.connectAccount('instacart');
    await loadOrders();
    setConnected(true);
    setConnecting(false);
  };

  const toggleItem = (orderId, itemIndex) => {
    const key = `${orderId}-${itemIndex}`;
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllFromOrder = (order) => {
    const updates = {};
    order.items.forEach((_, i) => { updates[`${order.id}-${i}`] = true; });
    setSelected((prev) => ({ ...prev, ...updates }));
  };

  const handleImport = async () => {
    const itemsToImport = [];
    orders.forEach((order) => {
      order.items.forEach((item, i) => {
        if (selected[`${order.id}-${i}`]) itemsToImport.push(item);
      });
    });

    if (!itemsToImport.length) return;
    setImporting(true);
    const result = await groceryService.importItems(itemsToImport);
    setImportResult(result.imported);
    setSelected({});
    fetchFridge();
    setImporting(false);
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div>
      <div className="page-header">
        <h1>Grocery Import</h1>
        <p>Import items directly from your grocery orders into your fridge</p>
      </div>

      {!connected ? (
        <div className={styles.connectCard}>
          <div className={styles.connectIcon}>🛒</div>
          <h2>Connect Your Grocery Account</h2>
          <p>
            Link your Instacart or grocery store account to automatically pull in items from
            recent orders — no manual entry required.
          </p>
          <button className="btn btn-primary" onClick={handleConnect} disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect Instacart (Simulated)'}
          </button>
          <p className={styles.simNote}>
            This is a simulated connection for demo purposes. In production this would use an OAuth flow.
          </p>
        </div>
      ) : (
        <>
          {importResult != null && (
            <div className={styles.successBanner}>
              {importResult} item{importResult !== 1 ? 's' : ''} added to your fridge.
            </div>
          )}

          <div className={styles.toolbar}>
            <span className={styles.selectedCount}>
              {selectedCount > 0 ? `${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected` : 'Select items to import'}
            </span>
            {selectedCount > 0 && (
              <button className="btn btn-primary" onClick={handleImport} disabled={importing}>
                {importing ? 'Importing…' : `Import ${selectedCount} Item${selectedCount !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {!orders ? (
            <LoadingSpinner />
          ) : (
            orders.map((order) => (
              <div key={order.id} className={styles.order}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.store}>{order.store}</span>
                    <span className={styles.orderDate}>· Ordered {formatDate(order.orderedAt)}</span>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '5px 12px' }} onClick={() => selectAllFromOrder(order)}>
                    Select All
                  </button>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => {
                    const key = `${order.id}-${i}`;
                    const isSelected = !!selected[key];
                    return (
                      <label key={key} className={`${styles.orderItem} ${isSelected ? styles.orderItemSelected : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItem(order.id, i)}
                          className={styles.checkbox}
                        />
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.name}</span>
                          {item.brand && <span className={styles.itemBrand}>{item.brand}</span>}
                        </div>
                        <div className={styles.itemMeta}>
                          <span>{item.quantity.amount} {item.quantity.unit}</span>
                          {item.expirationDate && (
                            <span className={styles.itemExp}>Exp: {formatDate(item.expirationDate)}</span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
