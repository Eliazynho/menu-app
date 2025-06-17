// store/cartActions.ts (atualizado)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartRestaurant, Product } from "@/types";
import { AdditionalCategory } from "@/types";
import { getAdditionals } from "@/pages/api/additionals";

// Actions existentes do cart
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

// Actions para adicionais
export const setAdditionalsLoading = (loading: boolean) => ({
  type: "SET_ADDITIONALS_LOADING",
  payload: { loading },
});

export const setAdditionalsSuccess = (
  categories: AdditionalCategory[],
  restaurantId: string
) => ({
  type: "SET_ADDITIONALS_SUCCESS",
  payload: { categories, restaurantId },
});

export const setAdditionalsError = (error: string) => ({
  type: "SET_ADDITIONALS_ERROR",
  payload: { error },
});

export const clearAdditionals = () => ({
  type: "CLEAR_ADDITIONALS",
});

// Action assíncrona para buscar adicionais
export const fetchAdditionals = (restaurantId: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(setAdditionalsLoading(true));
      const categories = await getAdditionals(restaurantId);
      dispatch(setAdditionalsSuccess(categories, restaurantId));
      console.log("Adicionais carregados:", categories);
    } catch (error) {
      console.error("Erro ao buscar adicionais:", error);
      dispatch(setAdditionalsError("Erro ao carregar adicionais"));
    }
  };
};
