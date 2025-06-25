/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOGIN_SUCCESS, LOGOUT } from "../actions/authActions"; // Mantenha suas actions types
import { UserData } from "@/types"; // Importe sua interface UserData

// Defina a interface para o estado do reducer de autenticação
export interface AuthState {
  isLoggedIn: boolean;
  // ✅ O tipo 'user' no estado deve ser o tipo do objeto 'client' dentro de UserData
  user: UserData["client"] | null;
  token: string | null;
  // Opcional: manter loading e error se quiser
  // loading: boolean;
  // error: string | null;
}

// Defina o estado inicial
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  // loading: false,
  // error: null,
};

// Crie o reducer (usando o tipo AuthAction se definido)
// const authReducer = (state = initialState, action: AuthAction): AuthState => { // Use este se definiu AuthAction
const authReducer = (state = initialState, action: any): AuthState => {
  // Mantido 'any' para compatibilidade com seu código atual
  switch (action.type) {
    case LOGIN_SUCCESS:
      // ✅ O action.payload é do tipo UserData { client: {...}, token: "..." }
      // Extraímos 'client' para 'user' e 'token' para 'token' do estado
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload?.client || null, // ✅ Salva o objeto 'client' na propriedade 'user'
        token: action.payload?.token || null, // ✅ Salva o 'token' na propriedade 'token'
        // loading: false, // Se estiver usando loading
        // error: null, // Se estiver usando error
      };
    case LOGOUT:
      return {
        ...initialState, // Volta para o estado inicial (não logado)
        // Opcional: Limpar localStorage/cookies aqui ou em um middleware/saga/thunk
      };
    // Adicione cases para outros tipos de action, como LOGIN_FAIL, etc.
    default:
      return state;
  }
};

export default authReducer;
