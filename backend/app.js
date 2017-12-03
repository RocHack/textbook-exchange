// Initialize Firebase
var config = {
    apiKey: "Replace this with your own config",
    authDomain: "Replace this with your own config",
    databaseURL: "Replace this with your own config",
    projectId: "Replace this with your own config",
    storageBucket: "Replace this with your own config",
    messagingSenderId: "Replace this with your own config"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();

var user = null;
var editBookId = null;

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

//Edit
const $modifyForm = document.getElementById("modifyForm");
const $textName = document.getElementsByClassName("textName");
const $price = document.getElementsByClassName("price");
const $updateForm = document.getElementById("update-form");

const $unameField = document.getElementById('unameField');
const $ueditionField = document.getElementById('ueditionField');
const $uconditionField = document.getElementById('uconditionField');
const $usubjectField = document.getElementById('usubjectField');
const $ucourseField = document.getElementById('ucourseField');
const $upricecField = document.getElementById('upriceField');
const $ucommentField = document.getElementById('ucommentField');

//TODO: Login persistence

//Sign up
$signUp.addEventListener("click", function () {
    const promise = firebase.auth().createUserWithEmailAndPassword($emailField.value, $passwordField.value);
    promise.catch(function (error) {
        console.log(error)
    });
});

//Log in
$logIn.addEventListener("click", function () {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword($emailField.value, $passwordField.value);
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
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        user = user;
        $loginStatus.innerHTML = "Login Status: " + user.email + " login";
        getOwnOutput();
        console.log(user);
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
            const docRef = firestore.collection("books").doc();
            let node = {
                Textbook: $nameField.value,
                Edition: $editionField.value,
                Condition: $conditionField.value,
                Subject: $subjectField.value,
                Course: $courseField.value,
                Price: $pricecField.value,
                Comment: $commentField.value,
                BookID: docRef.id,
                OwnerID: user.uid,
                Email: user.email
            };
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
            //console.log(doc.id, " => ", doc.data());
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
    //console.log("Own output");
    firestore.collection("books").where("OwnerID", "==", user.uid).get().then(function (querySnapshot) {
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

            let td1 = document.createElement('td');
            let td2 = document.createElement('td');

            let editButton = document.createElement('button');
            editButton.innerHTML = "Edit";
            editButton.id = node.BookID;
            editButton.className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent edit";

            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete";
            deleteButton.id = node.BookID;
            deleteButton.className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent delete";

            td1.appendChild(editButton);
            td2.appendChild(deleteButton);

            tab.appendChild(td1);
            tab.appendChild(td2);

            $ownTable.appendChild(tab);

            //console.log(doc.id, " => ", doc.data());
        });
    });
}

getOutput();

//Update
$(document).on("click", ".update", function (e) {
    if (firebase.auth().currentUser) {
        user = firebase.auth().currentUser;
    }
    else {
        return;
    }
    var docRef = firestore.collection("books").doc(editBookId);

    docRef.get().then(function (doc) {
        if (doc.exists && doc.data().OwnerID == user.uid) {
            let node = {
                Textbook: $unameField.value,
                Edition: $ueditionField.value,
                Condition: $uconditionField.value,
                Subject: $usubjectField.value,
                Course: $ucourseField.value,
                Price: $upricecField.value,
                Comment: $ucommentField.value,
            };
            docRef.update(node).then(function () {
                console.log("Document successfully updated!");
                $updateForm.style.display = "none";
            }).catch(function (error) {
                console.error("Error updating document: ", error);
            });
        } else {
            console.log("No such document or you are not the owner of this book post!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
})

//Edit
$(document).on("click", ".edit", function (e) {
    $updateForm.style.display = "block";
    //console.log("press edit");
    editBookId = e.target.id;
    //console.log(e.target.id);
});

//Delete
$(document).on("click", ".delete", function (e) {
    if (firebase.auth().currentUser) {
        user = firebase.auth().currentUser;
    }
    else {
        return;
    }
    var docRef = firestore.collection("books").doc(e.target.id);

    docRef.get().then(function (doc) {
        if (doc.exists && doc.data().ID == user.uid) {
            docRef.delete().then(function () {
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
        } else {
            console.log("No such document or you are not the owner of this book post!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
});
