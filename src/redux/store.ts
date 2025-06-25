// store/index.ts
import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import cartReducer, { CartState } from "./reducers/cartReducer";
import additionalsReducer, {
  AdditionalsState,
} from "./reducers/additionalsReducer";
import authReducer, { AuthState } from "./reducers/authReducer"; // Certifique-se de que o caminho está correto
import restaurantReducer from "./slices/restaurantSlice"; // Seu novo reducer de restaurante
import { Restaurant } from "@/types";

export interface RootState {
  cart: CartState;
  additionals: AdditionalsState;
  auth: AuthState;
  restaurant: Restaurant;
  // Adicione outros estados conforme necessário
}

const rootReducer = combineReducers({
  cart: cartReducer,
  additionals: additionalsReducer, // <-- Sem parênteses!
  auth: authReducer, // <-- Sem parênteses!
  restaurant: restaurantReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export type AppDispatch = typeof store.dispatch;
