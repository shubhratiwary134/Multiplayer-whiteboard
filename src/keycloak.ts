
import Keycloak from 'keycloak-js';


const keycloak = new Keycloak({
  url:'http://localhost:8080',
  realm:'WhiteBoard',
  clientId:'WhiteBoard',
});
keycloak.init({ onLoad: 'login-required' })
  .then((authenticated) => {
    console.log('Keycloak initialized:', authenticated);
  })
  .catch((error) => {
    console.error('Keycloak initialization failed:', error);
  });

export default keycloak;
