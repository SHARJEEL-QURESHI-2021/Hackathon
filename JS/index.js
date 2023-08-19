// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPRSxJO11u7GwfUHTvqTWmquZg8TLUf1E",
    authDomain: "hackathon-f9a35.firebaseapp.com",
    projectId: "hackathon-f9a35",
    storageBucket: "hackathon-f9a35.appspot.com",
    messagingSenderId: "514356291435",
    appId: "1:514356291435:web:c02b7ef83f64b434744e2e",
    measurementId: "G-X76CR3RW68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app);

const btn = document.getElementById("btn")

btn.addEventListener('click', async () => {

    const fName = document.getElementById("fName").value;
    const lName = document.getElementById("lName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rPassword = document.getElementById("rPassword").value;

    // Validate first name (3 to 20 characters)
    if (fName.length < 3 || fName.length > 20) {
        Swal.fire({
            title: `Input`,
            text: `Invalid First Name Length`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.log("Invalid first name length");
        return;
    }

    // Validate last name (1 to 20 characters)
    if (lName.length < 1 || lName.length > 20) {
        Swal.fire({
            title: `Input`,
            text: `Invalid Last Name Length`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.log("Invalid last name length");
        return;
    }

    // Validate email (using basic email format check)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        Swal.fire({
            title: `Email`,
            text: `Put @ in email`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.log("Invalid email format");
        return;
    }

    // Validate password (at least 8 characters with uppercase, lowercase, and a number)
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordPattern.test(password)) {
        Swal.fire({
            title: `Input`,
            text: `At Least 8 Characters With Uppercase, Lowercase, And A Number`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.log("Invalid password format");
        return;
    }

    // ...
    // Your Firebase code to add the data to the database
    // ...

    if (fName == "" && lName == "" && email == "" && password == "" && rPassword == "") {
        Swal.fire({
            title: `Input`,
            text: `Please Filled Input First`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        if (!event.key === "@") {
            alert("The '@' character is not allowed.");
        }
    }
    // FireStore
    // input length fname 3 lname 1 ziada sai ziada 20 password 8 kamskam uppercase and lowercase gmail @ lazmi
    else {
        if (password == rPassword) {
            try {
                const docRef = await addDoc(collection(db, "Users"), {
                    fName: fName,
                    lName: lName,
                    Email: email,
                });
                console.log("sers Collection: ", docRef.id);
            } catch (e) {
                console.log("Users Collection ID: ", e);
            }


            const onSnapshot = await getDocs(collection(db, "Users"));
            onSnapshot.forEach((doc) => {
                console.log(`Users Collection --> ${doc.id} => ${JSON.stringify(doc.data())}`);
            });
            // Sign In
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log("Sign In User:", user);
                    Swal.fire({
                        title: `Account`,
                        text: `Account Created Successfully`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = "./Pages/LogIn.html"
                    })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode == "auth/invalid-email" && errorMessage == "Firebase: Error (auth/invalid-email).") {
                        Swal.fire({
                            title: `Email`,
                            text: `Please Enter Email `,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    else if (errorCode == "auth/missing-email" && errorMessage == "Firebase: Error (auth/missing-email).") {
                        Swal.fire({
                            title: `Email`,
                            text: `Please Enter Email`,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    else if (errorCode == "auth/email-already-in-use" && errorMessage == "Firebase: Error (auth/email-already-in-use).") {
                        function any() {
                            Swal.fire({
                                title: `Email`,
                                text: `Email Already In Use And Redirect To LogIn Page`,
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                        setInterval(any, 4000)
                        function anker() {
                            window.location.href = "./Pages/LogIn.html"
                        }
                        setInterval(anker, 5000)
                    }
                    else if (errorCode == "auth/missing-password" && errorMessage == "Firebase: Error (auth/missing-password).") {
                        Swal.fire({
                            title: `Password`,
                            text: `Please Enter Password`,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    else if (errorCode == "auth/weak-password" && errorMessage == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                        Swal.fire({
                            title: `Password`,
                            text: ` Password Should Be At Least 6 Characters`,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    else {
                        console.log("Sign Up Page User ErrorCode: ", errorCode);
                        console.log("Sign Up Page User ErrorMessage: ", errorMessage);
                    }
                })
        } else {
            Swal.fire({
                title: `Password`,
                text: `Reapeat Password Is Incorrect`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
});