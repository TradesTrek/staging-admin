import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANwXgaZE4ab_1malCxaMSzBDVl6KDKW3g",
    authDomain: "keyless-b6325.firebaseapp.com",
    databaseURL: "https://keyless-b6325-default-rtdb.firebaseio.com",
    projectId: "keyless-b6325",
    storageBucket: "keyless-b6325.appspot.com",
    messagingSenderId: "663071047690",
    appId: "1:663071047690:web:ad68b27db47f1824179ff3",
    measurementId: "G-Q5Q53E07FZ"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BInOSvsbC-ZIrMFGSxOiEtdrnE2O-tPETqFnAAAwOL_46ePiA03exFwh0EszKWAnwX4iXWC13hJIwn3sw0zztFg' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});