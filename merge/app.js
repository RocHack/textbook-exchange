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
var firestore = firebase.firestore(); //TODO: change firestore name to db

// Initialize algolia
const ALGOLIA_ID = "8FJH3Q5YFR";
const ALGOLIA_ADMIN_KEY = "17ea4cdd6403c359ac4f61e01e842528";
const ALGOLIA_INDEX_NAME = "books";
const algolia = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = algolia.initIndex(ALGOLIA_INDEX_NAME);

//Other variables
var user = null;
var editBookId = null;
var provider = new firebase.auth.GoogleAuthProvider();

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

//Search
const $searchField = document.getElementById("searchField");
const $search = document.getElementById('search');
const $searchTable = document.getElementById('searchTable');

//TODO: Login persistence

//Sign up
/*$signUp.addEventListener("click", function () {
    const promise = firebase.auth().createUserWithEmailAndPassword($emailField.value, $passwordField.value);
    promise.catch(function (error) {
        console.log(error)
    });
});*/

//Log in
$logIn.addEventListener("click", function () {
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
    });
});

//Log out
/*$logOut.addEventListener("click", function () {
    firebase.auth().signOut();
    window.location.reload();
})*/

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
                window.location.reload();
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

//Search
//TODO: add algolia logo near the search (algolia requires community users to do that)
$search.addEventListener("click", function () {

    // Search query
    var query = $searchField.value;

    // Perform an Algolia search:
    // https://www.algolia.com/doc/api-reference/api-methods/search/
    index.search({
        query
    }).then(responses => {
        // Response from Algolia:
        // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
        var results = responses.hits;
        for (var i = 0; i < results.length; i++) {
            var result = results[i].BookID;
            console.log(result);

            firestore.collection("books").doc(result).get().then(function (doc) {
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
                $searchTable.appendChild(tab);
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
        //console.log(responses.hits);
    });

    //searchInput = $searchField.value;
    //getSearchOutput(searchInput);
    //console.log("Search completed!");
    //window.location.reload();
})

//Get real time update
/*getRealTimeUpdate = function () {
    firestore.collection("books").onSnapshot(function(querySnapshot) {
        //getOutput();
        //getOwnOutput();
        //window.location.reload();
        console.log("Get new updates!");
    });
}*/