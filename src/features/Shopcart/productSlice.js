import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Normalize DummyJSON products into a shape the rest of the app expects.
const normalize = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  price: Number(p.price),
  category: p.category,
  brand: p.brand || '',
  image: p.thumbnail || (p.images && p.images[0]) || '',
  images: Array.isArray(p.images) && p.images.length ? p.images : [p.thumbnail].filter(Boolean),
  stock: typeof p.stock === 'number' ? p.stock : 999,
  rating: {
    rate: Number(typeof p.rating === 'number' ? p.rating : p.rating?.rate || 0),
    count: typeof p.rating === 'number'
      ? (p.reviews?.length || Math.round((p.stock || 10) * 1.5))
      : (p.rating?.count || 0),
  },
  tags: Array.isArray(p.tags) ? p.tags : [],
});

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('https://dummyjson.com/products?limit=100&select=id,title,description,price,category,thumbnail,images,brand,stock,rating,tags');
      const list = Array.isArray(res.data?.products) ? res.data.products : [];
      return list.map(normalize);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load products';
      });
  },
});

export default productSlice.reducer;

export { normalize as normalizeProduct };
