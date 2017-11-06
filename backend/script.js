// Initialize Firebase
const config = {
  apiKey: "AIzaSyACfmkuXODDLwrZpGaSL6AZtFKGnPWj3Hc",
  authDomain: "duncan-test0.firebaseapp.com",
  databaseURL: "https://duncan-test0.firebaseio.com",
  projectId: "duncan-test0",
  storageBucket: "duncan-test0.appspot.com",
  messagingSenderId: "243968147627"
};

const app = firebase.initializeApp(config);

const $logIn = document.getElementById('logIn');
const $logOut = document.getElementById('logOut');
const $status = document.getElementById('status');
const $add = document.getElementById('add');
const $list = document.getElementById('list');
const $priceInput = document.getElementById('price-input');
const $titleInput = document.getElementById('title-input');

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');
const database = app.database();
const databaseRef = database.ref().child('list');

let user;
let email;

// BEGIN COMMENTED OUT STUFF

$logIn.addEventListener('click', () => {
  firebase.auth().signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;
    console.log($status);
    $status.textContent = 'Logged In';
  }).catch(error => {
    console.log(error);
  });
});

$logOut.addEventListener('click', () => {
  firebase.auth().signOut();
  $status.textContent = 'Not logged in.';
});

firebase.auth().onAuthStateChanged(fireBaseUser => {
  if (fireBaseUser) {
    email = fireBaseUser.email;
  } else {
    console.info('Not Logged In');
  }
});

$add.addEventListener('click', () => {
  if ($priceInput.value && $titleInput.value) {
    if (firebase.auth().currentUser) {
      let node = {price: $priceInput.value, title: $titleInput.value, user: email};
      databaseRef.push().set(node);
    }
  }
});

databaseRef.on('child_added', snapshot => {
  let node = snapshot.val();
  addNode(node);
});

function addNode(node) {
  var div = document.createElement("li");
  div.innerHTML = `${node.user} <br><b>$ ${node.price}</b> for <em> ${node.title}</em>`;
  $list.appendChild(div);
}
