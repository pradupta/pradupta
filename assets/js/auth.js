/**
 * ScoutDupta - Auth Helper Module
 */
import { 
  auth, 
  googleProvider, 
  db 
} from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      let role = 'member';
      let namaLengkap = user.displayName || user.email.split('@')[0];

      if (user.email === 'hafidzsajili464@gmail.com') {
        role = 'admin';
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          role = data.role || role;
          namaLengkap = data.nama_lengkap || namaLengkap;
        } else {
          // Create initial user document
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            nama_lengkap: namaLengkap,
            role: role,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("User profile fetch:", err);
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", namaLengkap);
      localStorage.setItem("userEmail", user.email);
      callback({ ...user, role, namaLengkap });
    } else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      callback(null);
    }
  });
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function registerWithEmail(email, password, namaLengkap, noWa = '') {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const role = email === 'hafidzsajili464@gmail.com' ? 'admin' : 'member';

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    nama_lengkap: namaLengkap,
    no_wa: noWa,
    role: role,
    createdAt: new Date().toISOString()
  });

  return user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
  localStorage.clear();
}
