// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP0F82jTlfDZDR4nPyRKc1Gy4j_eZ4PT4",
  authDomain: "new-york-tech-week.firebaseapp.com",
  projectId: "new-york-tech-week",
  storageBucket: "new-york-tech-week.appspot.com",
  messagingSenderId: "763279185195",
  appId: "1:763279185195:web:7d23e6a59a5e4868fca16e",
  measurementId: "G-YV7SH5YHQB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export const registerToDatabase = async (application) => {
  try {
    await addDoc(collection(db, "attendees"), application);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const registerEventDetailsToDatabase = async (event) => {
  try {
    await addDoc(collection(db, "events"), event);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// export const countAttendees = async () => {
//   const querySnapshot = await getDocs(collection(db, "attendees"));
//   const size = querySnapshot.size
//   console.log("Attendees count: ", size)
// }