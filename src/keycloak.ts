import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://keycloak:8080",
  realm: "WhiteBoard",
  clientId: "WhiteBoard",
});

export default keycloak;
