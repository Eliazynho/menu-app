// store/index.ts (atualizar o store principal)
import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import cartReducer, { CartState } from "./reducers/cartReducer";
import additionalsReducer, {
  AdditionalsState,
} from "./reducers/additionalsReducer";

export interface RootState {
  cart: CartState;
  additionals: AdditionalsState;
}

const rootReducer = combineReducers({
  cart: cartReducer,
  additionals: additionalsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
export type AppDispatch = typeof store.dispatch;
