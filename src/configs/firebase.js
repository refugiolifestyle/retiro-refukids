import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCF-R_8XyzQx6b3UBTzOXBI5aXf-2xTaoc",
  authDomain: "retiro-refukids.firebaseapp.com",
  databaseURL: "https://retiro-refukids-default-rtdb.firebaseio.com",
  projectId: "retiro-refukids",
  storageBucket: "retiro-refukids.appspot.com",
  messagingSenderId: "157038484707",
  appId: "1:157038484707:web:342edf3985ea59161579d6"
};

const firebaseConfigTeste = {
  apiKey: "AIzaSyCubXIEtjg0zndG5kEHvRFJoOK9S5Cct48",
  authDomain: "retiro-teste.firebaseapp.com",
  databaseURL: "https://retiro-teste-default-rtdb.firebaseio.com",
  projectId: "retiro-teste",
  storageBucket: "retiro-teste.appspot.com",
  messagingSenderId: "693062890363",
  appId: "1:693062890363:web:1f672f47092a049b64c3de"
};

export const firebaseApp = initializeApp(firebaseConfigTeste);
export const firebaseDatabase = getDatabase(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);