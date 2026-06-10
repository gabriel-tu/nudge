import { addDoc, writeBatch } from "firebase/firestore";
import {
  getCooldownRemaining,
  NUDGE_COOLDOWN_SECONDS,
  sendNudge,
} from "../services/nudges";
import { NudgeUser } from "../services/users";

jest.mock("../services/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn().mockResolvedValue({ id: "nudge1" }),
  collection: jest.fn((db, name) => name),
  doc: jest.fn((db, collectionName, uid) => `${collectionName}/${uid}`),
  writeBatch: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toMillis: () => Date.now() })),
  },
}));

const secondsAgo = (seconds: number) =>
  ({ toMillis: () => Date.now() - seconds * 1000 } as any);

const makeUser = (overrides: Partial<NudgeUser>): NudgeUser => ({
  uid: "me",
  userName: "gabe",
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  nudgeTimes: {},
  ...overrides,
});

describe("nudges service", () => {
  let batch: { update: jest.Mock; commit: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    batch = {
      update: jest.fn(),
      commit: jest.fn().mockResolvedValue(undefined),
    };
    (writeBatch as jest.Mock).mockReturnValue(batch);
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as any;
  });

  describe("getCooldownRemaining", () => {
    it("is 0 when the friend has never been nudged", () => {
      expect(getCooldownRemaining(makeUser({}), "friend1")).toBe(0);
    });

    it("counts down from the last nudge", () => {
      const me = makeUser({ nudgeTimes: { friend1: secondsAgo(10) } });
      expect(getCooldownRemaining(me, "friend1")).toBe(
        NUDGE_COOLDOWN_SECONDS - 10
      );
    });

    it("is 0 once the cooldown has passed", () => {
      const me = makeUser({
        nudgeTimes: { friend1: secondsAgo(NUDGE_COOLDOWN_SECONDS + 5) },
      });
      expect(getCooldownRemaining(me, "friend1")).toBe(0);
    });
  });

  describe("sendNudge", () => {
    const friend = makeUser({
      uid: "friend1",
      userName: "johnny",
      expoPushToken: "ExponentPushToken[abc]",
    });

    it("rejects while on cooldown", async () => {
      const me = makeUser({ nudgeTimes: { friend1: secondsAgo(5) } });
      await expect(sendNudge(me, friend)).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(addDoc).not.toHaveBeenCalled();
    });

    it("sends the push, records the nudge and stamps both users", async () => {
      const me = makeUser({});
      await sendNudge(me, friend);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://exp.host/--/api/v2/push/send",
        expect.objectContaining({ method: "POST" })
      );
      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      );
      expect(body.to).toBe("ExponentPushToken[abc]");
      expect(body.body).toContain("gabe");

      expect(addDoc).toHaveBeenCalledWith(
        "Nudges",
        expect.objectContaining({
          fromUid: "me",
          toUid: "friend1",
          participants: ["me", "friend1"],
        })
      );
      expect(batch.update).toHaveBeenCalledWith(
        "Users/me",
        expect.objectContaining({
          "nudgeTimes.friend1": expect.anything(),
        })
      );
      expect(batch.update).toHaveBeenCalledWith(
        "Users/friend1",
        expect.objectContaining({
          "nudgeTimes.me": expect.anything(),
        })
      );
      expect(batch.commit).toHaveBeenCalledTimes(1);
    });

    it("still records the nudge when the friend has no push token", async () => {
      const me = makeUser({});
      await sendNudge(me, { ...friend, expoPushToken: undefined });

      expect(global.fetch).not.toHaveBeenCalled();
      expect(addDoc).toHaveBeenCalled();
      expect(batch.commit).toHaveBeenCalledTimes(1);
    });
  });
});
