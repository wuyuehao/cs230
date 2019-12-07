import firebase from 'firebase/app'
import 'firebase/auth';

const config = {

    apiKey: "AIzaSyDJHkGrlBX--ic6Uho2wbriUi37-gmDAaI",
    authDomain: "nlp-dashboard.firebaseapp.com",
    databaseURL: "https://nlp-dashboard.firebaseio.com",
    projectId: "nlp-dashboard",
    storageBucket: "",
    messagingSenderId: "1069210134191",
    appId: "1:1069210134191:web:987371bb46062e75"
};

firebase.initializeApp(config);

export default firebase;
