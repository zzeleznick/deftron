let firebase = require('firebase');

var config = {
    apiKey: 'AIzaSyANgy-XJizsKLZ-u8DxYcdXYvn3_sllhzo',
    authDomain: 'rabbit-af6d6.firebaseapp.com', // 'localhost:4000',
    databaseURL: 'https://rabbit-af6d6.firebaseio.com'
};

firebase.initializeApp(config);

export const DB = firebase.database();