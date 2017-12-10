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

const $signOut = document.getElementById("signOut");

//Update:
const $nameField = document.getElementById('nameField');
const $editionField = document.getElementById('editionField');
const $isbnField = document.getElementById("isbnField");
const $conditionField = document.getElementById('conditionField');
const $subjectField = document.getElementById('subjectField');
const $courseField = document.getElementById('courseField');
const $pricecField = document.getElementById('priceField');
const $commentField = document.getElementById('commentField');
const $updateButton = document.getElementById('updateButton');

//Output
const $ownPostsTable = document.getElementById('ownPostsTable');

const $modal = document.getElementById('add-post');

//TODO: Login persistence

// Sign out:
$signOut.addEventListener("click", function () {
    firebase.auth().signOut();
    window.location.reload();
})

// Check auth state:
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        getOwnOutput();
        // TODO: delete console.log()
        console.log(user);
    } else {
        user = null;
        // TODO: delete console.log()
        console.log("Not login.");
    }
});

//Get users' own output
getOwnOutput = function () {
    if (firebase.auth().currentUser) {
    }
    else {
        return;
    }
    firestore.collection("books").where("OwnerID", "==", firebase.auth().currentUser.uid).get().then(function (querySnapshot) {
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

            let editButton = document.createElement('div');
            editButton.innerHTML = "Edit";
            editButton.id = node.BookID;
            editButton.className = "button mod-button edit";

            let deleteButton = document.createElement('div');
            deleteButton.innerHTML = "Delete";
            deleteButton.id = node.BookID;
            deleteButton.className = "button mod-button delete";

            td1.appendChild(editButton);
            td2.appendChild(deleteButton);

            tab.appendChild(td1);
            tab.appendChild(td2);

            $ownPostsTable.appendChild(tab);
        });
    });
}

//Update
$updateButton.addEventListener("click", function () {
    if (firebase.auth().currentUser) {
    }
    else {
        return;
    }
    var docRef = firestore.collection("books").doc(editBookId);

    docRef.get().then(function (doc) {
        if (doc.exists && doc.data().OwnerID == firebase.auth().currentUser.uid) {
            if ($nameField.value && $pricecField.value) {
                let node = {
                    Textbook: $nameField.value,
                    Edition: $editionField.value,
                    Condition: $conditionField.value,
                    //ISBN: $isbnField.value,
                    Subject: $subjectField.value,
                    Course: $courseField.value,
                    Price: $pricecField.value,
                    Comment: $commentField.value,
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
        } else {
            onsole.log("Essential information missed!");
        }

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
    $modal.style.display = "none";
})

//Edit
$(document).on("click", ".edit", function (e) {
    $modal.style.display = "flex";
    editBookId = e.target.id;
});

//Delete
$(document).on("click", ".delete", function (e) {
    if (firebase.auth().currentUser) {
    }
    else {
        return;
    }
    var docRef = firestore.collection("books").doc(e.target.id);

    docRef.get().then(function (doc) {
        if (doc.exists && doc.data().OwnerID == user.uid) {
            docRef.delete().then(function () {
                console.log("Document successfully deleted!");
                window.location.reload();
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