import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBWWgfRin7Rmm8pdwkG1qEwJ6CEDxynBjw",
    authDomain: "beforeidieiwantto.firebaseapp.com",
    databaseURL: "https://beforeidieiwantto-default-rtdb.firebaseio.com",
    projectId: "beforeidieiwantto",
    storageBucket: "beforeidieiwantto.appspot.com",
    messagingSenderId: "380871446865",
    appId: "1:380871446865:web:6160c965175d9842a40370",
    measurementId: "G-JPV0MZ79FG"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
