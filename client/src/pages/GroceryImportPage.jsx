import { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import { groceryService } from '../services/groceryService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateHelpers';

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
        <p>Pull items from your recent grocery orders directly into your fridge</p>
      </div>

      {!connected ? (
        <div className="grocery-connect-card">
          <div className="grocery-connect-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2>Connect Grocery Account</h2>
          <p>
            Link your Instacart or grocery store account to automatically pull in items from
            recent orders — no manual entry required.
          </p>
          <button className="btn btn-primary" onClick={handleConnect} disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect Instacart (Demo)'}
          </button>
          <p className="grocery-sim-note">
            Simulated connection for demo purposes. Production would use an OAuth flow.
          </p>
        </div>
      ) : (
        <>
          {importResult != null && (
            <div className="grocery-success-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {importResult} item{importResult !== 1 ? 's' : ''} added to your fridge.
            </div>
          )}

          <div className="grocery-toolbar">
            <span className="grocery-selected-count">
              {selectedCount > 0
                ? `${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected`
                : 'Select items to import'}
            </span>
            {selectedCount > 0 && (
              <button className="btn btn-primary" onClick={handleImport} disabled={importing}>
                {importing ? 'Importing…' : `Import ${selectedCount} item${selectedCount !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {!orders ? (
            <LoadingSpinner />
          ) : (
            orders.map((order) => (
              <div key={order.id} className="grocery-order">
                <div className="grocery-order-header">
                  <div>
                    <span className="grocery-store">{order.store}</span>
                    <span className="grocery-order-date">· {formatDate(order.orderedAt)}</span>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: '13px', padding: '6px 12px' }} onClick={() => selectAllFromOrder(order)}>
                    Select all
                  </button>
                </div>
                <div className="grocery-order-items">
                  {order.items.map((item, i) => {
                    const key = `${order.id}-${i}`;
                    const isSelected = !!selected[key];
                    return (
                      <label key={key} className={`grocery-order-item${isSelected ? ' grocery-order-item-selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItem(order.id, i)}
                          className="grocery-checkbox"
                        />
                        <div className="grocery-item-info">
                          <span className="grocery-item-name">{item.name}</span>
                          {item.brand && <span className="grocery-item-brand">{item.brand}</span>}
                        </div>
                        <div className="grocery-item-meta">
                          <span>{item.quantity.amount} {item.quantity.unit}</span>
                          {item.expirationDate && (
                            <span className="grocery-item-exp">Exp {formatDate(item.expirationDate)}</span>
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
