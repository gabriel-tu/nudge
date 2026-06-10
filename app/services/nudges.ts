import {
  addDoc,
  collection,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import { NudgeUser } from "./users";

export const NUDGE_COOLDOWN_SECONDS = 30;

export interface Nudge {
  id: string;
  fromUid: string;
  toUid: string;
  fromName: string;
  toName: string;
  participants: string[];
  createdAt: Timestamp;
}

// Seconds until `me` may nudge this friend again (0 = ready now).
export const getCooldownRemaining = (me: NudgeUser, friendUid: string) => {
  const lastNudge = me.nudgeTimes?.[friendUid];
  if (!lastNudge) return 0;
  const elapsedSeconds = (Date.now() - lastNudge.toMillis()) / 1000;
  return Math.max(0, Math.ceil(NUDGE_COOLDOWN_SECONDS - elapsedSeconds));
};

// Sends the push via Expo's push API (client-side by design — see plan),
// records the nudge, and stamps nudgeTimes on both users.
export const sendNudge = async (me: NudgeUser, friend: NudgeUser) => {
  if (getCooldownRemaining(me, friend.uid) > 0) {
    throw new Error("You can't nudge this friend again yet");
  }

  if (friend.expoPushToken) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: friend.expoPushToken,
        title: "Nudge!",
        body: `${me.userName} nudged you! 👋`,
        sound: "default",
        channelId: "nudges",
        data: { type: "nudge", fromUid: me.uid },
      }),
    });
  }

  const now = Timestamp.now();
  await addDoc(collection(db, "Nudges"), {
    fromUid: me.uid,
    toUid: friend.uid,
    fromName: me.userName,
    toName: friend.userName,
    participants: [me.uid, friend.uid],
    createdAt: now,
  });

  const batch = writeBatch(db);
  batch.update(doc(db, "Users", me.uid), {
    [`nudgeTimes.${friend.uid}`]: now,
  });
  batch.update(doc(db, "Users", friend.uid), {
    [`nudgeTimes.${me.uid}`]: now,
  });
  await batch.commit();
};
