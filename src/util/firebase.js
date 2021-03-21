import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDxgrRPIDzW0QVdO1y2oUG6ltGw725ECAs",
    databaseURL: 'https://crud-before-i-die-default-rtdb.firebaseio.com',
    authDomain: "crud-before-i-die.firebaseapp.com",
    projectId: "crud-before-i-die",
    storageBucket: "crud-before-i-die.appspot.com",
    messagingSenderId: "713619931160",
    appId: "1:713619931160:web:b573dbe52cdc597403036d",
    measurementId: "G-8VZZVMVHP1"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
