// hooks/useAdditionals.ts (atualizado)
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  fetchAdditionals,
  clearAdditionals,
} from "../redux/actions/cartActions";

export const useAdditionals = (restaurantId?: string) => {
  const dispatch = useAppDispatch();
  const { categories, loading, error, currentRestaurantId } = useAppSelector(
    (state) => state.additionals
  );

  useEffect(() => {
    if (restaurantId && restaurantId !== currentRestaurantId) {
      dispatch(fetchAdditionals(restaurantId));
    } else if (!restaurantId) {
      dispatch(clearAdditionals());
    }
  }, [restaurantId, dispatch, currentRestaurantId]);

  return {
    additionalCategories: categories,
    additionalsLoading: loading,
    additionalsError: error,
    currentRestaurantId,
  };
};
