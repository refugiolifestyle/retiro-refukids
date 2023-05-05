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

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);