import * as firebase from 'firebase';
const config={
    apiKey: "AIzaSyCl2kTFvb13So326BdiosY1blrdYlOl588",
    authDomain: "wide-axiom-267708.firebaseapp.com",
    databaseURL: "https://wide-axiom-267708.firebaseio.com",
    projectId: "wide-axiom-267708",
    storageBucket: "wide-axiom-267708.appspot.com",
    messagingSenderId: "323589888115",
    appId: "1:323589888115:web:0b696234c0b83be3983206"}
const fb = firebase.initializeApp(config);
export const db = firebase.database();
export const firestorage = firebase.storage();
export const postRef = firebase.database().ref().child('posts/');
export default fb;

