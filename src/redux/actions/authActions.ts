import { UserData } from "@/types";

// Defina os tipos de actions para autenticação

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
// Você pode adicionar mais, como LOGIN_FAIL, SET_USER_DATA, etc.

// Defina a interface para os dados do usuário que você espera
// Ajuste conforme os dados reais que sua API retornará

// Action Creator para login bem-sucedido
export const loginSuccess = (userData: UserData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

// Action Creator para logout
export const logout = () => ({
  type: LOGOUT,
});
