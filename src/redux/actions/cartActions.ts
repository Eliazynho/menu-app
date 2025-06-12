/* eslint-disable @typescript-eslint/no-explicit-any */
// store/cartActions.ts
import { CartRestaurant, Product } from "@/types";

export const addToCart = (
  restaurant: CartRestaurant,
  product: Product,
  quantity: number = 1,
  additionalOptions: any = {}
) => ({
  type: "ADD_TO_CART",
  payload: { restaurant, product, quantity, additionalOptions },
});

export const changeCartQuantity = (index: number, quantity: number) => ({
  type: "CHANGE_CART_QUANTITY",
  payload: { index, quantity },
});

export const removeFromCart = (index: number) => ({
  type: "REMOVE_FROM_CART",
  payload: { index },
});

export const updateAdditionals = (index: number, additionalOptions: any) => ({
  type: "UPDATE_ADDITIONALS",
  payload: { index, additionalOptions },
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});
