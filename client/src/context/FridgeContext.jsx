import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_FRIDGE } from '../mocks/data';

const FridgeContext = createContext(null);

export function FridgeProvider({ children }) {
  const [fridge, setFridge] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFridge = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setFridge(structuredClone(MOCK_FRIDGE));
    setLoading(false);
  }, []);

  const addItem = async (itemData) => {
    const item = {
      _id: `item-${Date.now()}`,
      addedBy: { name: 'Jaedon' },
      importSource: 'manual',
      ...itemData,
    };
    setFridge((prev) => ({ ...prev, items: [...(prev?.items || []), item] }));
    return item;
  };

  const updateItem = async (id, updates) => {
    let updated;
    setFridge((prev) => ({
      ...prev,
      items: prev.items.map((i) => {
        if (i._id === id) { updated = { ...i, ...updates }; return updated; }
        return i;
      }),
    }));
    return updated;
  };

  const deleteItem = async (id) => {
    setFridge((prev) => ({ ...prev, items: prev.items.filter((i) => i._id !== id) }));
  };

  return (
    <FridgeContext.Provider value={{ fridge, loading, fetchFridge, addItem, updateItem, deleteItem }}>
      {children}
    </FridgeContext.Provider>
  );
}

export const useFridge = () => useContext(FridgeContext);
