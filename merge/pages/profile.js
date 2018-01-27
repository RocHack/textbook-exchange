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
const $bottom = document.getElementById("bottom-prof");

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
function getOwnOutput() {
    if (firebase.auth().currentUser) {
    }
    else {
        return;
    }
    firestore.collection("books").where("OwnerID", "==", firebase.auth().currentUser.uid).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            node = doc.data();
            let wrapper = document.createElement("div");
            wrapper.className = 'sample-post';
            wrapper.innerHTML =
            `
            <div class="poster-info">
                <img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="" class="poster-img">
                <span class="poster-name">${node.Email}</span>
            </div>
            <div class="post-section--wide">
                <span class="txt-name">${node.Textbook}</span>
                <span class="txt-price post-right">$${node.Price}</span>
            </div>
            <div class="post-section">
                <span class="txt-edition">${node.Edition} Edition</span>
            </div>

            <div class="post-section">
                <span class="txt-class">${node.Subject} ${node.Course}</span>
            </div>
            
                <div class="post-section--wide">
                <span class="txt-condition">${node.Condition}</span>
                <button class="post-right button delete" id=${node.BookID}>Delete</button>
            </div>`;
            $bottom.appendChild(wrapper);
        });
    });
}

//Update
// $updateButton.addEventListener("click", function () {
//     if (firebase.auth().currentUser) {
//     }
//     else {
//         return;
//     }
//     var docRef = firestore.collection("books").doc(editBookId);
//     docRef.get().then(function (doc) {
//         if (doc.exists && doc.data().OwnerID == firebase.auth().currentUser.uid) {
//             if ($nameField.value && $pricecField.value) {
//                 let node = {
//                     Textbook: $nameField.value,
//                     Edition: $editionField.value,
//                     Condition: $conditionField.value,
//                     //ISBN: $isbnField.value,
//                     Subject: $subjectField.value,
//                     Course: $courseField.value,
//                     Price: $pricecField.value,
//                     Comment: $commentField.value,
//                 };
//                 docRef.update(node).then(function () {
//                     console.log("Document successfully updated!");
//                     //$updateForm.style.display = "none";
//                 }).catch(function (error) {
//                     console.error("Error updating document: ", error);
//                 });
//             } else {
//                 console.log("No such document or you are not the owner of this book post!");
//             }
//         } else {
//             onsole.log("Essential information missed!");
//         }

//     }).catch(function (error) {
//         console.log("Error getting document:", error);
//     });
//     //$modal.style.display = "none";
// })

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
        if (doc.exists && doc.data().OwnerID == firebase.auth().currentUser.uid) {
            docRef.delete().then(function () {
                console.log("Document successfully deleted!");
                window.alert("Book deleted!");
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