// redux/slices/restaurantSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Restaurant } from "@/types";

// Defina a interface para os dados do restaurante
// Ajuste esta interface para refletir a estrutura real dos dados retornados por getRestaurantBySlug

// Defina a interface para o estado do slice
export interface RestaurantState {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: RestaurantState = {
  restaurant: null,
  loading: false,
  error: null,
};

// Crie o slice
const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    // Action para iniciar o carregamento
    fetchRestaurantStart: (state) => {
      state.loading = true;
      state.error = null; // Limpa erros anteriores ao iniciar novo fetch
    },
    // Action para sucesso no carregamento
    fetchRestaurantSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.loading = false;
      state.restaurant = action.payload; // Salva os dados do restaurante no estado
      state.error = null;
    },
    // Action para falha no carregamento
    fetchRestaurantFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.restaurant = null; // Limpa os dados em caso de erro
      state.error = action.payload; // Salva a mensagem de erro
    },
    // Opcional: Action para limpar o estado do restaurante (ex: ao sair da página)
    clearRestaurant: (state) => {
      state.restaurant = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Exporte as actions e o reducer
export const {
  fetchRestaurantStart,
  fetchRestaurantSuccess,
  fetchRestaurantFailure,
  clearRestaurant,
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
