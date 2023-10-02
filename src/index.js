import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDoc,
  collection,
  addDoc,
  getDocs,
  doc,
  where,
  query,
} from "firebase/firestore";
import {
  signInAnonymously,
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXUFCi3Y_k0QmJGHFOQFzHrSVFDKUJa-c",
  authDomain: "n423-20e27.firebaseapp.com",
  projectId: "n423-20e27",
  storageBucket: "n423-20e27.appspot.com",
  messagingSenderId: "273133448656",
  appId: "1:273133448656:web:b539ad9c391b95a55f5dd5",
  measurementId: "G-20WTNQHVD4",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

// var loginbtn = document.getElementById("login");
// var logoutbtn = document.getElementById("logout");
// var addUserBtn = document.getElementById("addUser");
var getAllDataBtn = document.getElementById("getAllData");
var getQueryBtn = document.getElementById("getQueryButton");

// loginbtn.addEventListener("click", login);
// logoutbtn.addEventListener("click", logout);
// addUserBtn.addEventListener("click", addUserToDB);
getAllDataBtn.addEventListener("click", getAllData);
getQueryBtn.addEventListener("click", queryData);

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in", user);
  } else {
    console.log("no user");
  }
});

function addUserToDB() {
  let fn = document.getElementById("fName").value.toLowerCase();
  let ln = document.getElementById("lName").value.toLowerCase();
  let email = document.getElementById("email").value.toLowerCase();
  let pw = document.getElementById("pw").value.toLowerCase();

  let person = {
    firstName: fn,
    lastName: ln,
    email: email,
    password: pw,
  };

  addData(person);
}

async function addData(person) {
  try {
    const docRef = await addDoc(collection(db, "users"), person);
    document.getElementById("fName").value = "";
    document.getElementById("lName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pw").value = "";
    console.log("doc id:", docRef.id);
  } catch (e) {
    console.log(e);
  }
}

async function getAllData() {
  document.getElementById("allData").innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Albums"));
  let htmlStr = "";
  querySnapshot.forEach((doc) => {
    htmlStr += `<div style="border: 2px solid white; padding: 8px;">
        <p class="name"><span style="color: lightcoral;">ALBUM NAME:</span> ${
          doc.data().albumName
        }</p>
        <p class="name"><span style="color: lightcoral;">ARTIST NAME:</span> ${
          doc.data().artistName
        }</p>
        <p class="name"><span style="color: lightcoral;">GENRE:</span> ${
          doc.data().genre
        }</p>
        <img style="max-width: 200px;" src="../dist/images/${
          doc.data().photoURL
        }"/>
        
    </div>`;
  });
  document.getElementById("allData").innerHTML = htmlStr;
  addUserEditBtnLister();
}

async function getUser(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let user = docSnap.data();
    $("#singleUserData").html(
      `<input class="newName" type="text" id="userFn" value="${user.firstName}" disabled/>`
    );
  } else {
    console.log("getUser not working... no document exists");
  }
}

function addUserEditBtnLister() {
  $("#allData button").on("click", (e) => {
    console.log(e.currentTarget.id);
    getUser(e.currentTarget.id);
  });
}

async function queryData() {
  const albumsRef = collection(db, "Albums");
  let searchName = $("#query-input").val().toLowerCase();

  const q = query(albumsRef, where("genre", "==", searchName));

  const querySnapshot = await getDocs(q);
  document.getElementById("allData").innerHTML = "";
  let htmlStr = "";
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    htmlStr += `<div style="border: 2px solid white; padding: 8px;">
        <p class="name"><span style="color: lightcoral;">ALBUM NAME:</span> ${
          doc.data().albumName
        }</p>
        <p class="name"><span style="color: lightcoral;">ARTIST NAME:</span> ${
          doc.data().artistName
        }</p>
        <p class="name"><span style="color: lightcoral;">GENRE:</span> ${
          doc.data().genre
        }</p>
        <img style="max-width: 200px;" src="../dist/images/${
          doc.data().photoURL
        }"/>
        
    </div>`;
  });
  document.getElementById("allData").innerHTML = htmlStr;
  $("#query-input").val("");
}

function login() {
  signInAnonymously(auth)
    .then(() => {
      console.log("sign in");
    })
    .catch((e) => {
      console.log(e.code);
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      console.log("sign out");
    })
    .catch((e) => {
      console.log(e.code);
    });
}

// <button style="background-color: #6d6875; " id="${
//           doc.id
//         }">Get User</button>

$(document).ready(function () {
  getAllData();
  console.log("test");
});
