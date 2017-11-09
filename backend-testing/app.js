// Initialize Firebase
var config = {
    apiKey: "AIzaSyBKgtR_IxRiNe7vcSCmXSt9kLJkPU_lGEE",
    authDomain: "ur-book-a6b81.firebaseapp.com",
    databaseURL: "https://ur-book-a6b81.firebaseio.com",
    projectId: "ur-book-a6b81",
    storageBucket: "ur-book-a6b81.appspot.com",
    messagingSenderId: "83437624910"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();

var user = null;

//Login
const $emailField = document.getElementById('emailField');
const $passwordField = document.getElementById('passwordField');
const $signUp = document.getElementById('signUp');
const $logIn = document.getElementById('logIn');
const $logOut = document.getElementById('logOut');
const $loginStatus = document.getElementById('loginStatus');

//Input
const $nameField = document.getElementById('nameField');
const $editionField = document.getElementById('editionField');
const $conditionField = document.getElementById('conditionField');
const $subjectField = document.getElementById('subjectField');
const $courseField = document.getElementById('courseField');
const $pricecField = document.getElementById('priceField');
const $commentField = document.getElementById('commentField');
const $submit = document.getElementById('submit');

//Output
const $table = document.getElementById('table');
const $ownTable = document.getElementById('ownTable');

//Functions
//Sign up
$signUp.addEventListener("click", function () {
    const promise = firebase.auth().createUserWithEmailAndPassword($emailField.value, $passwordField.value);
    promise.catch(function (error) {
        console.log(error)
    });
});

//Log in
$logIn.addEventListener("click", function () {
    const email = $emailField.value;
    const password = $passwordField.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(function (error) {
        console.log(error);
    });
});

//Log out
$logOut.addEventListener("click", function () {
    firebase.auth().signOut();
    window.location.reload();
})

//Check auth state
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        user = firebase.auth().currentUser;
        $loginStatus.innerHTML = "Login Status: " + user.email + " login";
        getOwnOutput();
        console.log(firebaseUser);
    } else {
        user = null;
        $loginStatus.innerHTML = "Login Status: Not login";
        console.log("Not login.");
    }
});

//Submit
$submit.addEventListener("click", function () {
    if ($nameField.value && $pricecField.value) {
        if (firebase.auth().currentUser) {
            let node = {
                Textbook: $nameField.value,
                Edition: $editionField.value,
                Condition: $conditionField.value,
                Subject: $subjectField.value,
                Course: $courseField.value,
                Price: $pricecField.value,
                Comment: $commentField.value,
                ID: user.uid,
                Email: user.email
            };
            const docRef = firestore.doc("books/" + $nameField.value);
            docRef.set(node).then(function () {
                console.log("Book information saved!");
            }).catch(function (error) {
                console.log("Error: ", error);
            });;
        } else {
            console.log("Cannot enter input before login!");
        }
    } else {
        console.log("Essential information missed!");
    }

    //Save user information
    //TODO: find a solution to record user information when signing up
    $loginStatus.innerHTML = "Login Status: " + user.email + " sign up successfully!!";
    const userRef = firestore.doc("users/" + user.uid);
    let node = {
        ID: user.uid,
        Email: user.email
    };
    userRef.set(node).then(function () {
        console.log("User information saved!");
    }).catch(function (error) {
        console.log("Error: ", error);
    });
})

//Get output
getOutput = function () {
    firestore.collection("books").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            node = doc.data();
            let tab = document.createElement("tr");
            tab.innerHTML =
                `<td>${node.Textbook}</td>
            <td>${node.Edition}</td>
            <td>${node.Condition}</td>
            <td>${node.Subject}</td>
            <td>${node.Course}</td>
            <td>${node.Price}</td>
            <td>${node.Comment}</td>`;
            $table.appendChild(tab);
            console.log(doc.id, " => ", doc.data());
        });
    });
}

//Get users' own output
getOwnOutput = function () {
    if (firebase.auth().currentUser) {
        user = firebase.auth().currentUser;
    }
    else {
        return;
    }
    firestore.collection("books").where("ID", "==", user.uid).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            node = doc.data();
            let tab = document.createElement("tr");
            tab.innerHTML =
                `<td>${node.Textbook}</td>
            <td>${node.Edition}</td>
            <td>${node.Condition}</td>
            <td>${node.Subject}</td>
            <td>${node.Course}</td>
            <td>${node.Price}</td>
            <td>${node.Comment}</td>`;
            $pTable.appendChild(tab);
            console.log(doc.id, " => ", doc.data());
        });
    });
}

getOutput();