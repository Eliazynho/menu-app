// store/additionalsReducer.ts (atualizado)
import { AnyAction } from "redux";
import { AdditionalCategory } from "@/types";

export interface AdditionalsState {
  categories: AdditionalCategory[];
  loading: boolean;
  error: string | null;
  currentRestaurantId: string | null;
}

const initialState: AdditionalsState = {
  categories: [],
  loading: false,
  error: null,
  currentRestaurantId: null,
};

const additionalsReducer = (
  state = initialState,
  action: AnyAction
): AdditionalsState => {
  switch (action.type) {
    case "SET_ADDITIONALS_LOADING":
      return {
        ...state,
        loading: action.payload.loading,
        error: null,
      };

    case "SET_ADDITIONALS_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        loading: false,
        error: null,
        currentRestaurantId: action.payload.restaurantId,
      };

    case "SET_ADDITIONALS_ERROR":
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case "CLEAR_ADDITIONALS":
      return initialState;

    default:
      return state;
  }
};

export default additionalsReducer;
