import { AnyAction } from "redux";
import { CartItem, CartRestaurant } from "@/types";

export interface CartState {
  restaurant: CartRestaurant | null;
  items: CartItem[];
}

const initialState: CartState = {
  restaurant: null,
  items: [],
};

const cartReducer = (state = initialState, action: AnyAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const {
        restaurant,
        product,
        additionalOptions = {},
        quantity,
      } = action.payload;
      if (
        !state.restaurant ||
        (restaurant && state.restaurant.id === restaurant.id)
      ) {
        const existingIndex = state.items.findIndex(
          (item) =>
            item.product.id === product.id &&
            JSON.stringify(item.additionalOptions || {}) ===
              JSON.stringify(additionalOptions || {})
        );
        if (existingIndex !== -1) {
          const updated = [...state.items];
          updated[existingIndex].quantity += quantity;
          return { ...state, restaurant, items: updated };
        }
        return {
          ...state,
          restaurant,
          items: [...state.items, { product, additionalOptions, quantity }],
        };
      } else {
        // Novo restaurante
        return {
          restaurant,
          items: [{ product, additionalOptions, quantity }],
        };
      }
    }
    case "CHANGE_CART_QUANTITY": {
      const { index, quantity } = action.payload;
      const updated = [...state.items];
      if (quantity > 0) updated[index].quantity = quantity;
      return { ...state, items: updated };
    }
    case "REMOVE_FROM_CART": {
      const { index } = action.payload;
      const items = state.items.filter((_, i) => i !== index);
      return items.length === 0 ? initialState : { ...state, items };
    }
    case "UPDATE_ADDITIONALS": {
      const { index, additionalOptions } = action.payload;
      const updated = [...state.items];
      updated[index].additionalOptions = additionalOptions;
      return { ...state, items: updated };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
};
export default cartReducer;
