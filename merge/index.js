// Initialize Firebase
// TODO: delete Firebase information before commit to GitHub
var config = {
    apiKey: "AIzaSyBKgtR_IxRiNe7vcSCmXSt9kLJkPU_lGEE",
    authDomain: "ur-book-a6b81.firebaseapp.com",
    databaseURL: "https://ur-book-a6b81.firebaseio.com",
    projectId: "ur-book-a6b81",
    storageBucket: "ur-book-a6b81.appspot.com",
    messagingSenderId: "83437624910"
};
firebase.initializeApp(config);

var user = null;

const $signIn = document.getElementById("signIn");

// Sign in:
// TODO: the sign-in window does not pop up; delete unnecessary comments
$signIn.addEventListener("click", function () {
    /*var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });*/
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword("123@gmail.com", "123456");
    promise.catch(function (error) {
        console.log(error);
    });
    //window.location.replace("pages/posts.html")
});

// Check auth state:
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // TODO: delete console.log()
        console.log(user);
    } else {
        user = null;
        // TODO: delete console.log()
        console.log("Not login.");
    }
});
