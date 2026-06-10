import { arrayRemove, arrayUnion, doc, writeBatch } from "firebase/firestore";
import { db } from "./config";

const userDoc = (uid: string) => doc(db, "Users", uid);

export const sendFriendRequest = async (fromUid: string, toUid: string) => {
  const batch = writeBatch(db);
  batch.update(userDoc(fromUid), { outgoingFriendRequests: arrayUnion(toUid) });
  batch.update(userDoc(toUid), { incomingFriendRequests: arrayUnion(fromUid) });
  await batch.commit();
};

export const acceptFriendRequest = async (myUid: string, fromUid: string) => {
  const batch = writeBatch(db);
  batch.update(userDoc(myUid), {
    incomingFriendRequests: arrayRemove(fromUid),
    friends: arrayUnion(fromUid),
  });
  batch.update(userDoc(fromUid), {
    outgoingFriendRequests: arrayRemove(myUid),
    friends: arrayUnion(myUid),
  });
  await batch.commit();
};

export const declineFriendRequest = async (myUid: string, fromUid: string) => {
  const batch = writeBatch(db);
  batch.update(userDoc(myUid), {
    incomingFriendRequests: arrayRemove(fromUid),
  });
  batch.update(userDoc(fromUid), {
    outgoingFriendRequests: arrayRemove(myUid),
  });
  await batch.commit();
};

export const cancelFriendRequest = async (myUid: string, toUid: string) => {
  const batch = writeBatch(db);
  batch.update(userDoc(myUid), { outgoingFriendRequests: arrayRemove(toUid) });
  batch.update(userDoc(toUid), { incomingFriendRequests: arrayRemove(myUid) });
  await batch.commit();
};
