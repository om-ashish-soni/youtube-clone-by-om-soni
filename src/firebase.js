import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you
const firebaseConfig = {
  apiKey: "AIzaSyD_8bYk9fsN5p6v_OhAXh_agIULblGvfg0",
  authDomain: "yt-clone-om-soni.firebaseapp.com",
  projectId: "yt-clone-om-soni",
  storageBucket: "yt-clone-om-soni.appspot.com",
  messagingSenderId: "581493627935",
  appId: "1:581493627935:web:f9a1c412098cb14d98092a"
};

// Initialize Firebase
const app=firebase.initializeApp(firebaseConfig);
const db=getFirestore(app);
const auth=firebase.auth();
const provider=new firebase.auth.GoogleAuthProvider();
const storage = getStorage(app);
export {auth,provider,storage};
export default db;