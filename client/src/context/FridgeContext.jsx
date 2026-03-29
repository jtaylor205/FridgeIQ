import { createContext, useContext, useState, useCallback } from 'react';
import { fridgeService } from '../services/fridgeService';

const FridgeContext = createContext(null);

export function FridgeProvider({ children }) {
  const [fridge, setFridge] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFridge = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fridgeService.getFridge();
      setFridge(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (itemData) => {
    const item = await fridgeService.addItem(itemData);
    setFridge((prev) => ({ ...prev, items: [...(prev?.items || []), item] }));
    return item;
  };

  const updateItem = async (id, updates) => {
    const updated = await fridgeService.updateItem(id, updates);
    setFridge((prev) => ({
      ...prev,
      items: prev.items.map((i) => {
        if (i._id === id) return updated;
        return i;
      }),
    }));
    return updated;
  };

  const deleteItem = async (id) => {
    await fridgeService.deleteItem(id);
    setFridge((prev) => ({ ...prev, items: prev.items.filter((i) => i._id !== id) }));
  };

  return (
    <FridgeContext.Provider value={{ fridge, loading, fetchFridge, addItem, updateItem, deleteItem }}>
      {children}
    </FridgeContext.Provider>
  );
}

export const useFridge = () => useContext(FridgeContext);
