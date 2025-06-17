import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import additionalsReducer from "./additionalsReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  additionals: additionalsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
