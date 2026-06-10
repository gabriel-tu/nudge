import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import FriendScreen from "../screens/friend/[id]";
import { getCooldownRemaining, sendNudge } from "../services/nudges";
import { NudgeUser, subscribeToUser } from "../services/users";

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);
jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ id: "friend1" })),
  router: { back: jest.fn() },
}));
jest.mock("../services/config", () => ({
  auth: { currentUser: { uid: "me" } },
}));
jest.mock("../services/users", () => ({
  subscribeToUser: jest.fn(),
}));
jest.mock("../services/nudges", () => ({
  getCooldownRemaining: jest.fn(() => 0),
  sendNudge: jest.fn(() => Promise.resolve()),
}));

jest.useFakeTimers();

const me: NudgeUser = {
  uid: "me",
  userName: "gabe",
  friends: ["friend1"],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  nudgeTimes: {},
};

const friend: NudgeUser = {
  uid: "friend1",
  userName: "johnny",
  friends: ["me"],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  expoPushToken: "ExponentPushToken[abc]",
};

describe("FriendScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCooldownRemaining as jest.Mock).mockReturnValue(0);
    (subscribeToUser as jest.Mock).mockImplementation(
      (uid: string, callback: (user: NudgeUser) => void) => {
        callback(uid === "me" ? me : friend);
        return jest.fn();
      }
    );
  });

  it("renders the friend and an enabled NUDGE button", () => {
    render(<FriendScreen />);

    expect(screen.getByTestId("friendName")).toHaveTextContent("johnny");
    const nudgeButton = screen.getByTestId("nudgeButton");
    expect(nudgeButton).toHaveTextContent("NUDGE");
    expect(nudgeButton.props.accessibilityState?.disabled).not.toBe(true);
  });

  it("sends a nudge when the button is pressed", async () => {
    render(<FriendScreen />);

    await waitFor(() => {
      act(() => {
        fireEvent.press(screen.getByTestId("nudgeButton"));
      });
    });

    expect(sendNudge).toHaveBeenCalledWith(me, friend);
  });

  it("disables the button and shows a countdown during cooldown", () => {
    (getCooldownRemaining as jest.Mock).mockReturnValue(7);
    render(<FriendScreen />);

    const nudgeButton = screen.getByTestId("nudgeButton");
    expect(nudgeButton).toHaveTextContent("7");
    expect(nudgeButton.props.accessibilityState?.disabled).toBe(true);
  });
});
