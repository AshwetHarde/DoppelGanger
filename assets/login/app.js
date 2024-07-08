
const firebaseConfig = {
  apiKey: "AIzaSyBz4hyqPgjKjhTE_OxPdcevi0lDts7ts_Y",
  authDomain: "doppelganger-in.firebaseapp.com",
  databaseURL: "https://doppelganger-in-default-rtdb.firebaseio.com",
  projectId: "doppelganger-in",
  storageBucket: "doppelganger-in.appspot.com",
  messagingSenderId: "861774340022",
  appId: "1:861774340022:web:b84930f0e8b8e310d2ab17",
  measurementId: "G-TP2JBZQJKS"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var auth = firebase.auth();

/* Real-time Database Setup */
const usersRef = database.ref("users");

usersRef.on("value", (snapshot) => {
  // Remove the following line to prevent updating the realtimeData element
  // document.getElementById("realtimeData").innerHTML = ""; // Optional: Clear previous data

  // If you want to do something with the user data, you can add your logic here
  // ...

  // Example: Log user data to console
  console.log("User Data:", snapshot.val());
});

/* Existing Functions */

// SIGN UP
function signUpLoad() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      window.location.href = "../products/product.html";
    } else {
      // User is signed out
      // ...
    }
  });
}

function isEmailValid(email) {
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "mail.com",
    "zoho.com",
    "protonmail.com",
    "yandex.com"
  ];
    const emailDomain = email.split('@')[1];
  return allowedDomains.includes(emailDomain);
}

function isUsernameUnique(username) {
  // Check if the username already exists in the database
  const usernamesRef = database.ref("usernames");
  return new Promise((resolve, reject) => {
    usernamesRef.once("value")
      .then((snapshot) => {
        const usernames = snapshot.val() || {};
        if (!usernames[username]) {
          resolve(true); // Username is unique
        } else {
          resolve(false); // Username already taken
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function saveUserToDB() {
  let username = document.getElementById("username").value;
  let fullname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert("Password must have at least 8 characters, including numbers and special symbols.");
    return;
  }

  // Email validation
  if (!isEmailValid(email)) {
    alert("Invalid email domain. Please use a valid email address");
    return;
  }

  // Username validation
  if (!(await isUsernameUnique(username))) {
    alert("Username already taken. Please choose a different username.");
    return;
  }

  // Create user and save to database
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Save user data
      const userId = userCredential.user.uid;
      database.ref("users").child(userId).set({
        username: username,
        fullname: fullname,
        email: email,
        password: password
      });

      // Save username for uniqueness check
      database.ref("usernames").child(username).set(userId);

      alert("User account created!");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

// SIGN IN
function signInLoad() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      window.location.href = "../products/product.html";
    } else {
      // User is signed out
      // ...
    }
  });
}

function signInToSite() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      window.location.href = "../products/product.html";
    })
    .catch((error) => {
      console.error("Firebase Auth Error:", error);

      var errorCode = error.code;
      var errorMessage = error.message;

      switch (errorCode) {
        case "auth/user-not-found":
          alert("User not found. Please check your email address or sign up if you don't have an account.");
          break;

        case "auth/wrong-password":
          alert("Incorrect password. Please double-check your password and try again.");
          break;

        default:
          alert("An error occurred. Please check the Details.");
      }
    });
}


// HOME
function homeLoad() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      
    } else {
      // User is signed out
      window.location.href = "sign-in.html";
    }
  });
}

function signOutUserAccount() {
  auth.signOut().then(() => {
    // Sign-out successful.
    window.location.href = "sign-in.html";
  }).catch((error) => {
    // An error happened.
  });
}

  

