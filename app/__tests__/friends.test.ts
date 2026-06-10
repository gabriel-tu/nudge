import {
  acceptFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from "../services/friends";
import { arrayRemove, arrayUnion, writeBatch } from "firebase/firestore";

jest.mock("../services/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn((db, collectionName, uid) => `${collectionName}/${uid}`),
  arrayUnion: jest.fn((value) => ({ op: "union", value })),
  arrayRemove: jest.fn((value) => ({ op: "remove", value })),
  writeBatch: jest.fn(),
}));

describe("friends service", () => {
  let batch: { update: jest.Mock; commit: jest.Mock };

  beforeEach(() => {
    batch = {
      update: jest.fn(),
      commit: jest.fn().mockResolvedValue(undefined),
    };
    (writeBatch as jest.Mock).mockReturnValue(batch);
    jest.clearAllMocks();
    (writeBatch as jest.Mock).mockReturnValue(batch);
  });

  it("sendFriendRequest adds to both users' request arrays", async () => {
    await sendFriendRequest("me", "them");

    expect(batch.update).toHaveBeenCalledWith("Users/me", {
      outgoingFriendRequests: arrayUnion("them"),
    });
    expect(batch.update).toHaveBeenCalledWith("Users/them", {
      incomingFriendRequests: arrayUnion("me"),
    });
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it("acceptFriendRequest clears requests and makes both users friends", async () => {
    await acceptFriendRequest("me", "them");

    expect(batch.update).toHaveBeenCalledWith("Users/me", {
      incomingFriendRequests: arrayRemove("them"),
      friends: arrayUnion("them"),
    });
    expect(batch.update).toHaveBeenCalledWith("Users/them", {
      outgoingFriendRequests: arrayRemove("me"),
      friends: arrayUnion("me"),
    });
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it("declineFriendRequest clears the request from both users", async () => {
    await declineFriendRequest("me", "them");

    expect(batch.update).toHaveBeenCalledWith("Users/me", {
      incomingFriendRequests: arrayRemove("them"),
    });
    expect(batch.update).toHaveBeenCalledWith("Users/them", {
      outgoingFriendRequests: arrayRemove("me"),
    });
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });
});
