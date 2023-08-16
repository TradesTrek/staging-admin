import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";

const config = {
    apiKey: "AIzaSyANwXgaZE4ab_1malCxaMSzBDVl6KDKW3g",
    authDomain: "keyless-b6325.firebaseapp.com",
    databaseURL: "https://keyless-b6325-default-rtdb.firebaseio.com",
    projectId: "keyless-b6325",
    storageBucket: "keyless-b6325.appspot.com",
    messagingSenderId: "663071047690",
    appId: "1:663071047690:web:ad68b27db47f1824179ff3",
    measurementId: "G-Q5Q53E07FZ"
  };

  const app = initializeApp(config);

  // Get a reference to the database service
  const database = getDatabase(app);


export const getUsers = async () => {
    const db = getDatabase();
    const starCountRef = ref(db, 'users');
    onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    });
}