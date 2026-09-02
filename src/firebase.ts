import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocFromServer,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import firebaseConfigData from "../firebase-applet-config.json";

export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use the designated database ID for Firestore
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore connection on boot as per specification
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error: any) {
    if (error?.message && error.message.includes("the client is offline")) {
      console.warn("Firebase client appears offline. Please check network/config.");
    }
  }
}
testConnection();

export interface UserProfile {
  uid: string;
  email: string;
  emailVerified: boolean;
  credits: number;
  plan: "none" | "basico" | "postulante" | "empleo_usa";
  createdAt: string;
  updatedAt: string;
}

// Auth helpers
export async function registerWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // Send email verification immediately
  await sendEmailVerification(cred.user);
  
  // Create user profile in Firestore with initial 1 free welcome credit
  const userRef = doc(db, "users", cred.user.uid);
  const newProfile: UserProfile = {
    uid: cred.user.uid,
    email: cred.user.email || email,
    emailVerified: cred.user.emailVerified,
    credits: 1, // 1 revisión gratuita de bienvenida al crear cuenta
    plan: "none",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await setDoc(userRef, newProfile);
  
  return cred.user;
}

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // Sync verification status to firestore if changed
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(auth, provider);
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function resendVerificationEmail(user: FirebaseUser): Promise<void> {
  await sendEmailVerification(user);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// User Profile & Credits Management
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

export async function syncUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    const data = existing.data() as UserProfile;
    // Update verification if user verified
    if (user.emailVerified !== data.emailVerified) {
      await updateDoc(userRef, {
        emailVerified: user.emailVerified,
        updatedAt: new Date().toISOString(),
      });
      data.emailVerified = user.emailVerified;
    }
    return data;
  } else {
    // First time user (e.g. Google Sign in)
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      emailVerified: user.emailVerified,
      credits: 1, // 1 revisión gratuita de bienvenida
      plan: "none",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
}

export function subscribeUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("Error in user profile subscription:", err);
  });
}

// Deduct 1 credit when performing a CV evaluation
export async function deductCredit(uid: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return false;
    const profile = snap.data() as UserProfile;
    if (profile.credits <= 0) return false;

    await updateDoc(userRef, {
      credits: increment(-1),
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error("Error deducting credit:", err);
    return false;
  }
}

// Add credits after payment (accumulates)
export async function addPlanCredits(
  uid: string,
  planId: "basico" | "postulante" | "empleo_usa",
  credits: number,
  amount: number
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    credits: increment(credits),
    plan: planId,
    updatedAt: new Date().toISOString(),
  });

  // Log payment record
  const paymentRef = collection(db, "payments");
  await addDoc(paymentRef, {
    userId: uid,
    planId,
    amount,
    creditsAdded: credits,
    status: "completed",
    timestamp: new Date().toISOString(),
  });
}

// Process payment return from Stripe Payment Link redirect
export async function processStripePaymentSession(
  uid: string,
  sessionId: string,
  rawPlanKey: string
): Promise<{
  success: boolean;
  creditsAdded: number;
  planName: string;
  alreadyProcessed: boolean;
  message?: string;
}> {
  const cleanPlan = (rawPlanKey || "").toLowerCase().trim();
  let planId: "basico" | "postulante" | "empleo_usa" = "basico";
  let creditsToAdd = 1;
  let amount = 1;
  let planName = "Plan Básico ($1 USD - 1 Revisión)";

  if (cleanPlan.includes("postulante") || cleanPlan === "5") {
    planId = "postulante";
    creditsToAdd = 6;
    amount = 5;
    planName = "Plan Postulante ($5 USD - 6 Revisiones)";
  } else if (cleanPlan.includes("empleo") || cleanPlan.includes("usa") || cleanPlan === "10") {
    planId = "empleo_usa";
    creditsToAdd = 12;
    amount = 10;
    planName = "Plan Empleo en USA ($10 USD - 12 Revisiones)";
  }

  // Ensure unique session document ID
  const cleanSessionId = sessionId && sessionId !== "{CHECKOUT_SESSION_ID}" 
    ? sessionId.replace(/[^a-zA-Z0-9_\-]/g, "_")
    : `manual_${Date.now()}`;

  const paymentDocRef = doc(db, "payments", cleanSessionId);
  try {
    const paymentSnap = await getDoc(paymentDocRef);

    if (paymentSnap.exists()) {
      return {
        success: true,
        creditsAdded: 0,
        planName,
        alreadyProcessed: true,
        message: "Este pago ya fue acreditado previamente a tu cuenta.",
      };
    }

    // Record payment in Firestore
    await setDoc(paymentDocRef, {
      userId: uid,
      planId,
      amount,
      creditsAdded: creditsToAdd,
      sessionId: cleanSessionId,
      status: "completed",
      timestamp: new Date().toISOString(),
    });

    // Increment user credits (accumulating)
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      credits: increment(creditsToAdd),
      plan: planId,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      creditsAdded: creditsToAdd,
      planName,
      alreadyProcessed: false,
      message: `¡Pago acreditado con éxito! Se sumaron +${creditsToAdd} revisiones acumulables a tu cuenta.`,
    };
  } catch (err: any) {
    console.error("Error processing stripe payment session:", err);
    // Fallback: still increment credits if user doc is accessible
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        credits: increment(creditsToAdd),
        plan: planId,
        updatedAt: new Date().toISOString(),
      });
      return {
        success: true,
        creditsAdded: creditsToAdd,
        planName,
        alreadyProcessed: false,
        message: `¡Pago acreditado con éxito! Se sumaron +${creditsToAdd} revisiones a tu cuenta.`,
      };
    } catch (fallbackErr) {
      return {
        success: false,
        creditsAdded: 0,
        planName,
        alreadyProcessed: false,
        message: "No se pudo actualizar el balance de créditos.",
      };
    }
  }
}

// Scans history management
export async function saveScanRecord(userId: string, scanData: {
  jobTitle: string;
  jobDescription: string;
  cvSnippet: string;
  score: number;
  result: any;
}): Promise<string> {
  const scansRef = collection(db, "scans");
  const docRef = await addDoc(scansRef, {
    userId,
    jobTitle: scanData.jobTitle,
    jobDescription: scanData.jobDescription,
    cvSnippet: scanData.cvSnippet,
    score: scanData.score,
    result: scanData.result,
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
}

export function subscribeUserScans(userId: string, callback: (scans: any[]) => void) {
  const scansRef = collection(db, "scans");
  const q = query(
    scansRef,
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const items: any[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() });
    });
    callback(items);
  }, (err) => {
    console.error("Error subscribing to scans:", err);
    // Fallback if composite index is pending
    const simpleQ = query(scansRef, where("userId", "==", userId));
    return onSnapshot(simpleQ, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() });
      });
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(items);
    });
  });
}

export async function deleteScanRecord(scanId: string): Promise<void> {
  await deleteDoc(doc(db, "scans", scanId));
}
