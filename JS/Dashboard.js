import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, deleteDoc, getDoc, getDocs, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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

const logout = document.getElementById("log")

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        Swal.fire({
            title: `Log Out`,
            text: `Log Out Successfully `,
            icon: 'success',
            confirmButtonText: 'OK'
        });
        function wrongs() {
            window.location.href = "../index.html";
        }
        setInterval(wrongs, 3000);
    }).catch((error) => {
        console.log("LogOut Error -->", error)
    });
});

document.getElementById('btn').addEventListener('click', async () => {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value
    try {
        const docRef = await addDoc(collection(db, "Blogs"), {
            Title: title,
            Description: description,
            Timestamp: new Date(),
        })
        console.log("Blogs Collection ID: ", docRef.id);
    } catch (e) {
        console.error("Blogs Collection Error --> ", e);
    }
    setInterval(time, 3000);
})
function time() {
    location.reload();
}


onAuthStateChanged(auth, async (user) => {
    if (user) {
        // document.getElementById("signout").style.display = "block"
        const onSnapshot = await getDocs(collection(db, "Users"));
        onSnapshot.forEach((doc) => {
            console.log(`Users Collection --> ${doc.id} => ${JSON.stringify(doc.data())}`);
            document.getElementById("username").innerHTML = doc.data().fName;
        });
        const querySnapshot = await getDocs(collection(db, "Blogs"));
        const userEmail = user.email;
        const username = userEmail.split("@")[0]; // Extract the username part
        // console.log(username,"aaaaaa");
        let show = document.getElementById('show');
        show.innerHTML = ''
        querySnapshot.forEach(async (doc) => {
            const timestamp = doc.data().Timestamp.toDate();
            const formattedTimestamp = timestamp.toLocaleDateString();

            show.innerHTML += `
                    <div id="card">
                <div id="any">
                <img src="../img/user.png" alt="Blog">
                <div>
                <h3>${doc.data().Title}</h3>
                <p><span id="nameShow">${username}</span>- Posted on: <span>${formattedTimestamp}</span></p>
                </div>
                </div>
                <div id="showDesc">
                ${doc.data().Description}
                </div>
                <div>
                <button id="del" onclick="del('${doc.id}')">Delete</button><button id="edit" onclick="edit('${doc.id}')">Edit</button>
                </div>
                </div>
                `
            // console.log(`Users Collection --> ${doc.id} => ${JSON.stringify(doc.data())}`);

            console.log(`Blogs Collection --> ${doc.id} => ${JSON.stringify(doc.data())}`);

        })


    } else {
        Swal.fire({
            title: `Account`,
            text: `First Create An Account`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        function wrong() {
            location.replace("../index.html")
        }
        setInterval(wrong, 2000);
    }
})
const edit = async (id) => {

    console.log(id);
    Swal.fire({
        title: 'Enter Updated Title',
        input: 'text',
        confirmButtonText: 'Confirm',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const editText = doc(db, "Blogs", id);
            await updateDoc(editText, {
                Title: result.value,
            })
        }
        Swal.fire({
            title: 'Enter Updated Description',
            input: 'text',
            confirmButtonText: 'Confirm',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const editText = doc(db, "Blogs", id);
                await updateDoc(editText, {
                    Description: result.value,
                })
                Swal.fire({
                    title: `Edit Blog Successfully`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                })
            }
        })
    });
}

window.edit = edit;

window.del = async (id) => {
    console.log(id);
    await deleteDoc(doc(db, "Blogs", id));
    Swal.fire({
        title: `Delete Blogs`,
        text: `Delete Text Successfully`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
    function time() {
        location.reload()
    }
    setInterval(time, 3000);
}