import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export interface NudgeUser {
  uid: string;
  userName: string;
  photoBase64?: string;
  expoPushToken?: string;
  friends: string[];
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
  nudgeTimes?: Record<string, Timestamp>;
}

const userDoc = (uid: string) => doc(db, "Users", uid);

const toNudgeUser = (uid: string, data: Record<string, any>): NudgeUser => ({
  uid,
  userName: data.userName ?? "",
  photoBase64: data.photoBase64,
  expoPushToken: data.expoPushToken,
  friends: data.friends ?? [],
  incomingFriendRequests: data.incomingFriendRequests ?? [],
  outgoingFriendRequests: data.outgoingFriendRequests ?? [],
  nudgeTimes: data.nudgeTimes ?? {},
});

export const createUserDoc = (uid: string, userName: string) =>
  setDoc(userDoc(uid), {
    userName,
    friends: [],
    outgoingFriendRequests: [],
    incomingFriendRequests: [],
  });

export const getUser = async (uid: string): Promise<NudgeUser | null> => {
  const snapshot = await getDoc(userDoc(uid));
  return snapshot.exists() ? toNudgeUser(uid, snapshot.data()) : null;
};

export const getUsers = async (uids: string[]): Promise<NudgeUser[]> => {
  const users = await Promise.all(uids.map(getUser));
  return users.filter((user): user is NudgeUser => user !== null);
};

export const subscribeToUser = (
  uid: string,
  callback: (user: NudgeUser | null) => void
) =>
  onSnapshot(userDoc(uid), (snapshot) =>
    callback(snapshot.exists() ? toNudgeUser(uid, snapshot.data()) : null)
  );

export const updateUser = (
  uid: string,
  data: Partial<Omit<NudgeUser, "uid">>
) => updateDoc(userDoc(uid), data);

export const findUserByUsername = async (
  userName: string
): Promise<NudgeUser | null> => {
  const result = await getDocs(
    query(collection(db, "Users"), where("userName", "==", userName))
  );
  if (result.empty) return null;
  const match = result.docs[0];
  return toNudgeUser(match.id, match.data());
};
