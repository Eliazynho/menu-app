// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CartState } from "./reducers/cartReducer";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = {
  cart: CartState;
};

export type AppDispatch = typeof store.dispatch;
