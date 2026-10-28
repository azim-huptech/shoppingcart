import { createSlice } from "@reduxjs/toolkit";

const GUEST_KEY = 'shopping_cart_items_guest';
const userKey = (userId) => `shopping_cart_items_user_${userId}`;

const currentOwnerKey = () => {
  try {
    const stored = localStorage.getItem('current_user');
    const user = stored ? JSON.parse(stored) : null;
    return user?.id ? userKey(user.id) : GUEST_KEY;
  } catch {
    return GUEST_KEY;
  }
};

const loadItemsFor = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveItemsFor = (key, items) => {
  try { localStorage.setItem(key, JSON.stringify(items)); } catch { /* ignore */ }
};

// Max we'll ever let a quantity reach, even if a product has no stock number.
const DEFAULT_CAP = 99;

const stockFor = (item) => {
  const s = Number(item?.stock);
  if (!Number.isFinite(s) || s <= 0) return DEFAULT_CAP;
  return s;
};

const clamp = (item, qty) => {
  const cap = stockFor(item);
  if (qty < 1) return 1;
  return Math.min(qty, cap);
};

const calculateTotal = (items) => {
  const sum = items.reduce((acc, item) => acc + Number(item.price) * (Number(item.quantity) || 1), 0);
  return Math.round(sum * 100) / 100;
};

const totalsFrom = (items) => ({
  totalPrice: calculateTotal(items),
  totalQuantity: items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0),
});

const initialKey = currentOwnerKey();
const initialItems = loadItemsFor(initialKey);

const initialState = {
  ownerKey: initialKey,
  items: initialItems,
  tempItems: initialItems.map((i) => ({ ...i })),
  stockWarning: null,
  ...totalsFrom(initialItems),
};

const refresh = (state) => {
  state.tempItems = state.items.map((i) => ({ ...i }));
  const { totalPrice, totalQuantity } = totalsFrom(state.items);
  state.totalPrice = totalPrice;
  state.totalQuantity = totalQuantity;
  saveItemsFor(state.ownerKey, state.items);
};

const mergeItems = (a, b) => {
  const map = new Map();
  for (const it of [...a, ...b]) {
    if (map.has(it.id)) {
      const prev = map.get(it.id);
      const combined = { ...prev, quantity: prev.quantity + it.quantity };
      combined.quantity = clamp(combined, combined.quantity);
      map.set(it.id, combined);
    } else {
      map.set(it.id, { ...it, quantity: clamp(it, it.quantity) });
    }
  }
  return Array.from(map.values());
};

const warn = (state, title, cap) => {
  state.stockWarning = { title, cap, at: Date.now() };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const cap = stockFor(product);
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= cap) {
          warn(state, product.title, cap);
          return;
        }
        existingItem.quantity += 1;
      } else {
        if (cap < 1) {
          warn(state, product.title, cap);
          return;
        }
        state.items.push({ ...product, quantity: 1 });
      }
      refresh(state);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      refresh(state);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      const num = parseInt(quantity, 10);
      if (isNaN(num) || num <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        const capped = clamp(item, num);
        if (capped < num) warn(state, item.title, stockFor(item));
        item.quantity = capped;
      }
      refresh(state);
    },
    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      const cap = stockFor(item);
      if (item.quantity >= cap) {
        warn(state, item.title, cap);
        return;
      }
      item.quantity += 1;
      refresh(state);
    },
    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.quantity > 1) item.quantity -= 1;
      else state.items = state.items.filter((i) => i.id !== action.payload);
      refresh(state);
    },
    updateTempQuantity(state, action) {
      const { id, quantity } = action.payload;
      const tempItem = state.tempItems.find((i) => i.id === id);
      const cartItem = state.items.find((i) => i.id === id);
      if (tempItem && cartItem) {
        const parsed = parseInt(quantity, 10);
        const normalized = isNaN(parsed) || parsed < 1 ? 1 : parsed;
        const capped = clamp(cartItem, normalized);
        if (capped < normalized) warn(state, cartItem.title, stockFor(cartItem));
        tempItem.quantity = capped;
      }
    },
    applyTempUpdate(state, action) {
      const id = action.payload;
      const tempItem = state.tempItems.find((i) => i.id === id);
      const cartItem = state.items.find((i) => i.id === id);
      if (cartItem && tempItem) cartItem.quantity = clamp(cartItem, tempItem.quantity);
      refresh(state);
    },
    applyAllTempUpdates(state) {
      state.items = state.tempItems.map((i) => ({ ...i, quantity: clamp(i, i.quantity) }));
      refresh(state);
    },
    clearCart(state) {
      state.items = [];
      refresh(state);
    },
    clearStockWarning(state) {
      state.stockWarning = null;
    },
    switchCartOwner(state, action) {
      const { userId, mergeGuest } = action.payload || {};
      const newKey = userId ? userKey(userId) : GUEST_KEY;
      const guestItems = loadItemsFor(GUEST_KEY);
      const userItems = loadItemsFor(newKey);
      let next = userItems;
      if (userId && mergeGuest && guestItems.length) {
        next = mergeItems(userItems, guestItems);
        saveItemsFor(GUEST_KEY, []);
      }
      state.ownerKey = newKey;
      state.items = next;
      refresh(state);
    },
  },
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
  clearCart,
  clearStockWarning,
  switchCartOwner,
} = cartSlice.actions;

export default cartSlice.reducer;
