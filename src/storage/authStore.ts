import { create } from "zustand";
import keycloak from "src/keycloak";

interface AuthState {
    keycloak: Keycloak.KeycloakInstance;
    isAuthenticated:boolean;
    initKeycloak:()=>void;
    login:()=>void;
    logout:()=>void;
}
const useAuthStore=create<AuthState>((set)=>({
    keycloak,
    isAuthenticated:false,
    initKeycloak:()=>{
        keycloak.init({onLoad:'login-required'}).then((authenticated)=>{
            set({isAuthenticated:authenticated})
        })
    },
    login:()=>{
        keycloak.login();
    },
    logout:()=>{
        keycloak.logout();
        set({isAuthenticated:false});
    }


}));
export default useAuthStore;