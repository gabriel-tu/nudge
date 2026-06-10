import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  setPersistence,
} from "firebase/auth";
// @ts-expect-error -- shipped in firebase's react-native bundle but missing from the web type defs
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig, "nudge-app");
let analytics;
if (typeof window !== "undefined") {
  analytics = isSupported().then((supported) =>
    supported ? getAnalytics(app) : null
  );
}
const db = getFirestore(app);

// browserLocalPersistence only works on web; native needs AsyncStorage-backed
// persistence or the user is signed out on every app launch.
const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
if (Platform.OS === "web") {
  setPersistence(auth, browserLocalPersistence);
}

export { analytics, app, auth, db };
