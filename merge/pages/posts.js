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

// Initialize algolia
const ALGOLIA_ID = "8FJH3Q5YFR";
const ALGOLIA_ADMIN_KEY = "17ea4cdd6403c359ac4f61e01e842528";
const ALGOLIA_INDEX_NAME = "books";
const algolia = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = algolia.initIndex(ALGOLIA_INDEX_NAME);

// Sign out:
const $signOut = document.getElementById("signOut");

// Input:
const $nameField = document.getElementById("nameField");
const $editionField = document.getElementById("editionField");
//const $isbnField = document.getElementById("isbnField");
const $conditionField = document.getElementById("conditionField");
const $subjectField = document.getElementById("subjectField");
const $courseField = document.getElementById("courseField");
const $priceField = document.getElementById("priceField");
const $commentField = document.getElementById("commentField");
const $submitButton = document.getElementById("submitButton");

// Output:
const $postsTable = document.getElementById("postsTable");
const $bottom = document.getElementById("bottom");

// Search:
const $searchField = document.getElementById("search-field");
const $searchButton = document.getElementById("searchButton");

// Pop up input form:
const $fab = document.getElementById("add-button");
const $cancel = document.getElementById("cancel");
const $modal = document.getElementById("add-post");

//TODO: Login persistence

// Sign out:
$signOut.addEventListener("click", function () {
    firebase.auth().signOut();
    window.location.href = '../index.html';
})

// Check auth state:
// TODO: Detect auth state and change the sign-in button text
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

// Pop up the input window:
$fab.addEventListener('click', e => {
    if ($modal.style.display == 'flex') {
        $modal.style.display = 'none';
    } else {
        $modal.style.display = 'flex';
    }
});

$cancel.addEventListener('click', e => {
    $modal.style.display = 'none';
});

//Submit
$submitButton.addEventListener("click", function () {
    if ($nameField.value && $priceField.value) {
        if (firebase.auth().currentUser) {
            const docRef = firestore.collection("books").doc();
            let node = {
                Textbook: $nameField.value,
                Edition: $editionField.value,
                Condition: $conditionField.value,
                //ISBN: $isbnField.value,
                Subject: $subjectField.value,
                Course: $courseField.value,
                Price: $priceField.value,
                Comment: $commentField.value,
                BookID: docRef.id,
                OwnerID: firebase.auth().currentUser.uid,
                Email: firebase.auth().currentUser.email
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
    $modal.style.display = 'none';
})

//Get output

// Old function, for table
// function getOutput() {
//     firestore.collection("books").get().then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             node = doc.data();
//             let tab = document.createElement("tr");
//             tab.innerHTML =
//                 `<td>${node.Textbook}</td>
//             <td>${node.Edition}</td>
//             <td>${node.Condition}</td>
//             <td>${node.Subject}</td>
//             <td>${node.Course}</td>
//             <td>${node.Price}</td>
//             <td>${node.Comment}</td>`;
//             $postsTable.appendChild(tab);
//         });
//     });
// }

// Updated function
function getOutput() {
    firestore.collection("books").get().then(function (querySnapshot) {
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
                <span class="txt-name">${node.Textbook}e</span>
                <span class="txt-price post-right">$${node.Price}</span>
            </div>
            <div class="post-section">
                <span class="txt-edition">${node.Edition}</span>
            </div>

            <div class="post-section">
                <span class="txt-class">${node.Subbject} ${node.Course}</span>
            </div>
            
            <div class="post-section--wide">
                <span class="txt-condition">${node.Condition}</span>
                <button class="post-right button">Buy</button>
            </div>`;
            $bottom.appendChild(wrapper);
        });
    });
}

getOutput();

//Search
// TODO: fix accuracy, function call on delete key pressed
$searchField.addEventListener('keypress', function () {
    //console.log($postsTable.getElementsByTagName("tr").length);
    //$postsTable.deleteRow(0);
    while ($postsTable.getElementsByTagName("tr").length > 1) {
        //console.log("remove");
        $postsTable.deleteRow(1);
    }
    // Search query
    var query = $searchField.value;
    // Perform an Algolia search:
    // https://www.algolia.com/doc/api-reference/api-methods/search/
    index.search({ query }).then(responses => {
        // Response from Algolia:
        // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
        var results = responses.hits;
        for (var i = 0; i < results.length; i++) {
            var result = results[i].BookID;
            firestore.collection("books").doc(result).get().then(function (doc) {
                node = doc.data();
                let wrapper = document.createElement("div");
            wrapper.className = 'sample-post';
            wrapper.innerHTML =
            `
            <div class="poster-info">
              <img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="" class="poster-img">
              <span class="poster-name">John Doe</span>
            </div>
            <div class="post-section">
              <span class="txt-name">${node.Textbook}</span>
              <span class="txt-edition">${node.Edition} Edition</span>
            </div>
      
            <div class="post-section--wide">
              <span class="txt-price">$${node.Price}</span>
              <span class="txt-condition post-right">${node.Condition} Condition</span>
            </div>
            
            <div class="post-section--wide">
              <span class="txt-subject">Subject goes here</span>
              <span class="txt-class post-right">${node.Subject} ${node.Course}</span>
            </div>`;
            $bottom.appendChild(wrapper);
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    });
})

//const contactsRef = database.ref('/contacts');
//const docRef = firestore.collection("books").doc();
//contactsRef.on('child_added', addOrUpdateIndexRecord);
//contactsRef.on('child_changed', addOrUpdateIndexRecord);
//contactsRef.on('child_removed', deleteIndexRecord);

/*function syncToAlgolia() {
    firestore.collection("books").onSnapshot(function (snapshot) {
        snapshot.docChanges.forEach(function (change) {
            if (change.type === "added") {
                addOrUpdateIndexRecord(change);
                console.log("New book: ", change.doc.data());
            }
            if (change.type === "modified") {
                addOrUpdateIndexRecord(change);
                console.log("Modified book: ", change.doc.data());
            }
            if (change.type === "removed") {
                deleteIndexRecord(change);
                console.log("Removed book: ", change.doc.data());
            }
        });
    });
}

syncToAlgolia();

function addOrUpdateIndexRecord(book) {
    // Get Firebase object
    const record = book.doc.data();
    // Specify Algolia's objectID using the Firebase object key
    record.objectID = book.doc.BookID;
    // Add or update object
    index.saveObject(record).then(() => {
        console.log('Firebase object indexed in Algolia', record.objectID);
    }).catch(error => {
        console.error('Error when indexing contact into Algolia', error);
        //process.exit(1);
    });
}

function deleteIndexRecord(book) {
    // Get Algolia's objectID from the Firebase object key
    const objectID = book.doc.BookID;
    // Remove the object from Algolia
    index.deleteObject(objectID).then(() => {
        console.log('Firebase object deleted from Algolia', objectID);
    }).catch(error => {
        console.error('Error when deleting contact from Algolia', error);
        //process.exit(1);
    });
}

function putDataToAlgolia() {
    firestore.collection("books").get().then(function (querySnapshot) {
        // Build an array of all records to push to Algolia
        const records = [];

        querySnapshot.forEach(function (doc) {
            const book = doc.data();
            book.objectID = book.BookID;
            records.push(book);
        });

        // Add or update new objects
        index.saveObjects(records).then(() => {
            console.log('Contacts imported into Algolia');
        }).catch(error => {
            console.error('Error when importing contact into Algolia', error);
            //process.exit(1);
        });
    });
}

putDataToAlgolia();*/