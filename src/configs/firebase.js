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
  apiKey: "AIzaSyBU9Ife0xr2r6y9ZGALgGk9bb3_IEfUAFQ",
  authDomain: "teste-ff206.firebaseapp.com",
  databaseURL: "https://teste-ff206-default-rtdb.firebaseio.com",
  projectId: "teste-ff206",
  storageBucket: "teste-ff206.firebasestorage.app",
  messagingSenderId: "90362482679",
  appId: "1:90362482679:web:01171f43fb26e3147528f2"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);