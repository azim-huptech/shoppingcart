import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/Shopcart/productSlice';
import cartReducer from '../features/Shopcart/cartSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});
