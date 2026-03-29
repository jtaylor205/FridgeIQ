import { useEffect, useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import FridgeShelf from '../components/fridge/FridgeShelf';
import AddItemModal from '../components/fridge/AddItemModal';
import ItemDetailModal from '../components/fridge/ItemDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SHELVES = ['top', 'middle', 'bottom', 'drawer', 'door'];

const SHELF_LABELS = {
  top: 'Top Shelf',
  middle: 'Middle Shelf',
  bottom: 'Bottom Shelf',
  drawer: 'Crisper Drawer',
  door: 'Door',
};

export default function FridgePage() {
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
        <h1>My Fridge</h1>
        <p>
          {totalItems === 0
            ? 'Your fridge is empty — add your first item below'
            : `${totalItems} item${totalItems !== 1 ? 's' : ''} tracked across ${SHELVES.length} sections`}
        </p>
      </div>

      {SHELVES.map((shelf) => (
        <FridgeShelf
          key={shelf}
          label={SHELF_LABELS[shelf]}
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
