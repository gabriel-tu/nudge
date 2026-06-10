import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import FriendsScreen from "../(tabs)/index";
import {
  acceptFriendRequest,
  sendFriendRequest,
} from "../services/friends";
import {
  findUserByUsername,
  getUsers,
  NudgeUser,
  subscribeToUser,
} from "../services/users";

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));
jest.mock("../services/config", () => ({
  auth: { currentUser: { uid: "me" } },
}));
jest.mock("../services/users", () => ({
  subscribeToUser: jest.fn(),
  getUsers: jest.fn(),
  findUserByUsername: jest.fn(),
}));
jest.mock("../services/friends", () => ({
  sendFriendRequest: jest.fn(() => Promise.resolve()),
  acceptFriendRequest: jest.fn(() => Promise.resolve()),
  declineFriendRequest: jest.fn(() => Promise.resolve()),
}));

jest.useFakeTimers();

const me: NudgeUser = {
  uid: "me",
  userName: "gabe",
  friends: ["friend1"],
  incomingFriendRequests: ["requester1"],
  outgoingFriendRequests: [],
  nudgeTimes: {},
};

const users: Record<string, NudgeUser> = {
  friend1: {
    uid: "friend1",
    userName: "johnny",
    friends: ["me"],
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
  },
  requester1: {
    uid: "requester1",
    userName: "anna",
    friends: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: ["me"],
  },
  stranger1: {
    uid: "stranger1",
    userName: "newguy",
    friends: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
  },
};

describe("FriendsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (subscribeToUser as jest.Mock).mockImplementation(
      (uid: string, callback: (user: NudgeUser) => void) => {
        callback(me);
        return jest.fn();
      }
    );
    (getUsers as jest.Mock).mockImplementation((uids: string[]) =>
      Promise.resolve(uids.map((uid) => users[uid]))
    );
  });

  it("renders friends and incoming requests", async () => {
    render(<FriendsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("friendItem-johnny")).toBeTruthy();
      expect(screen.getByTestId("friendRequest-anna")).toBeTruthy();
    });
  });

  it("accepts an incoming friend request", async () => {
    render(<FriendsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("friendRequest-anna")).toBeTruthy();
    });

    await waitFor(() => {
      act(() => {
        fireEvent.press(screen.getByTestId("friendRequest-annaAcceptButton"));
      });
    });

    expect(acceptFriendRequest).toHaveBeenCalledWith("me", "requester1");
  });

  it("searches for a user and sends a friend request", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(users.stranger1);
    render(<FriendsScreen />);

    const searchBar = screen.getByTestId("addFriendSearchBar");
    await waitFor(() => {
      act(() => {
        fireEvent.changeText(searchBar, "newguy");
      });
    });
    await waitFor(() => {
      act(() => {
        fireEvent(searchBar, "submitEditing");
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("sendRequestButton")).toBeTruthy();
    });

    await waitFor(() => {
      act(() => {
        fireEvent.press(screen.getByTestId("sendRequestButton"));
      });
    });

    expect(sendFriendRequest).toHaveBeenCalledWith("me", "stranger1");
  });

  it("shows a message when no user matches the search", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(null);
    render(<FriendsScreen />);

    const searchBar = screen.getByTestId("addFriendSearchBar");
    await waitFor(() => {
      act(() => {
        fireEvent.changeText(searchBar, "ghost");
      });
    });
    await waitFor(() => {
      act(() => {
        fireEvent(searchBar, "submitEditing");
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("searchMessage")).toHaveTextContent(
        'No user found named "ghost"'
      );
    });
  });
});
