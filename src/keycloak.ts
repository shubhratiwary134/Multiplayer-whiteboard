
import Keycloak from 'keycloak-js';


const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'Whiteboard-app',
  clientId: 'whiteboard-client',
});

export default keycloak;
