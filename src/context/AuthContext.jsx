import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Firestore extra data
  const [loading, setLoading] = useState(true);

  // Register new user
  async function register({ email, password, displayName, role, company }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });

    // Save extra info to Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      role, // 'employer' | 'jobseeker'
      company: company || null,
      createdAt: serverTimestamp(),
    });

    return cred.user;
  }

  // Login
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  // Fetch Firestore profile
  async function fetchProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) setProfile(snap.data());
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};