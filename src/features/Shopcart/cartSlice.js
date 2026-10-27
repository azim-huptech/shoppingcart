import { createSlice } from "@reduxjs/toolkit";

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

const loadCartFromStorage = () => {
  try {
    const storage = getStorage();
    if (!storage) return [];
    const saved = storage.getItem('shopping_cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem('shopping_cart_items', JSON.stringify(items));
    }
  } catch (e) {
    // silently ignore storage errors
  }
};

const calculateTotal = (items) => {
  const sum = items.reduce((acc, item) => acc + (Number(item.price) * (Number(item.quantity) || 1)), 0);
  return Math.round(sum * 100) / 100;
};

const initialItems = loadCartFromStorage();

const initialState = {
  items: initialItems,
  tempItems: initialItems.map(item => ({ ...item })),
  totalPrice: calculateTotal(initialItems),
  totalQuantity: initialItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      state.tempItems = state.items.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    removeFromCart(state, action) {
      const idToRemove = action.payload;
      state.items = state.items.filter(item => item.id !== idToRemove);
      state.tempItems = state.items.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const num = parseInt(quantity, 10);
      if (isNaN(num) || num <= 0) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.quantity = num;
        }
      }
      state.tempItems = state.items.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    incrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }
      state.tempItems = state.items.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    decrementQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== id);
        }
      }
      state.tempItems = state.items.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    updateTempQuantity(state, action) {
      const { id, quantity } = action.payload;
      const tempItem = state.tempItems.find(item => item.id === id);
      if (tempItem) {
        const parsed = parseInt(quantity, 10);
        tempItem.quantity = isNaN(parsed) || parsed < 1 ? 1 : parsed;
      }
    },

    applyTempUpdate(state, action) {
      const id = action.payload;
      const tempItem = state.tempItems.find(item => item.id === id);
      const cartItem = state.items.find(item => item.id === id);
      if (cartItem && tempItem) {
        cartItem.quantity = tempItem.quantity;
      }
      state.tempItems = state.items.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    applyAllTempUpdates(state) {
      state.items = state.tempItems.map(item => ({ ...item }));
      state.totalPrice = calculateTotal(state.items);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      state.tempItems = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      saveCartToStorage([]);
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  updateTempQuantity,
  applyTempUpdate,
  applyAllTempUpdates,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
