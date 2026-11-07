// Capa 1: Inicialización de las llaves del proyecto UniLocate
const firebaseConfig = {
  apiKey: "AIzaSyAiBwlgUQkJR8_Dt1SYQ9f6ZaIY1dKoIvY",
  authDomain: "agromarket-uleam-f3517.firebaseapp.com",
  projectId: "agromarket-uleam-f3517",
  storageBucket: "agromarket-uleam-f3517.appspot.com",
  messagingSenderId: "864388880274",
  appId: "1:864388880274:web:49d84424afc6771478934b"
};

// Inicializar Firebase en el navegador
firebase.initializeApp(firebaseConfig);

// Clientes globales para usar en toda la página web
const auth = firebase.auth();
const db = firebase.firestore();

// Restricción institucional para el registro en la ULEAM
const DOMINIO_ULEAM = "@uleam.edu.ec";
