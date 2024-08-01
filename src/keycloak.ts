
import Keycloak from 'keycloak-js';


const keycloak = new Keycloak({
  url:'http://localhost:8080',
  realm:'WhiteBoard',
  clientId:'WhiteBoard',
});


export default keycloak;
