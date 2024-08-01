import create from 'zustand';
import keycloak from '../keycloak'; 

interface AuthState {
  keycloak: Keycloak.KeycloakInstance | null;
  isAuthenticated: boolean;
  initKeycloak: () => Promise<void>;
  login: () => void;
  logout: () => void;
  error: string | null; 
}

const useAuthStore = create<AuthState>((set) => ({
  keycloak: null,
  isAuthenticated: false,
  error: null,
  initKeycloak: async () => {
    try {
      const authenticated = await keycloak.init({ onLoad: 'login-required' });
      set({ keycloak, isAuthenticated: authenticated });
    } catch (error) {
      set({ error: error.message });
    }
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
