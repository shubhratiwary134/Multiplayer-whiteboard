import { create } from "zustand";
import keycloak from "../keycloak"; 

interface AuthState {
  keycloak: Keycloak.KeycloakInstance;
  isAuthenticated: boolean;
  initKeycloak: () => void;
  login: () => void;
  logout: () => void;
  error: string | null; 
}

const useAuthStore = create<AuthState>((set) => ({
  keycloak,
  isAuthenticated: false,
  error: null,
  initKeycloak: () => {
    
    set({ isAuthenticated: keycloak.authenticated });
  },
  login: () => {
    keycloak.login();
  },
  logout: () => {
    keycloak.logout();
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
