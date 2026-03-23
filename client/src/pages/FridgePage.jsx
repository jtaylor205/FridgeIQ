import { useEffect, useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import { useAuth } from '../context/AuthContext';
import FridgeShelf from '../components/fridge/FridgeShelf';
import AddItemModal from '../components/fridge/AddItemModal';
import ItemDetailModal from '../components/fridge/ItemDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SHELVES = ['top', 'middle', 'bottom', 'drawer', 'door'];

export default function FridgePage() {
  const { user } = useAuth();
  const { fridge, loading, fetchFridge } = useFridge();
  const [addModal, setAddModal] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    fetchFridge();
  }, [fetchFridge]);

  if (loading) return <LoadingSpinner />;

  const itemsByShelf = (shelf) => (fridge?.items || []).filter((i) => i.shelf === shelf);
  const totalItems = fridge?.items?.length ?? 0;

  return (
    <div>
      <div className="page-header">
        <h1>Fridge View</h1>
        <p>Tracking {totalItems} item{totalItems !== 1 ? 's' : ''} in your virtual kitchen</p>
      </div>

      {SHELVES.map((shelf) => (
        <FridgeShelf
          key={shelf}
          label={shelf.charAt(0).toUpperCase() + shelf.slice(1) + ' Shelf'}
          items={itemsByShelf(shelf)}
          onItemClick={setDetailItem}
          onAddClick={() => setAddModal(shelf)}
        />
      ))}

      {addModal && (
        <AddItemModal
          initialShelf={addModal}
          onClose={() => setAddModal(null)}
        />
      )}

      {detailItem && (
        <ItemDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}
    </div>
  );
}
