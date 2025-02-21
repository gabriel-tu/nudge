import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import SignupScreen from "../screens/signup";

// https://github.com/callstack/react-native-testing-library/issues/1712
jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});

//this fixes a lot of random errors and I don't know why
jest.useFakeTimers();

describe("LoginScreen", () => {
  beforeEach(() => {
    render(<SignupScreen />);
  });

  it("renders correctly", () => {
    expect(screen.getByTestId("titleSubText")).toBeTruthy();
    expect(screen.getByTestId("emailField")).toBeTruthy();
    expect(screen.getByTestId("usernameField")).toBeTruthy();
    expect(screen.getByTestId("passwordField")).toBeTruthy();
    expect(screen.getByTestId("confirmPasswordField")).toBeTruthy();
    expect(screen.getByTestId("createAccountButton")).toBeTruthy();
    expect(screen.getByTestId("loginButton")).toBeTruthy();
  });

  it("updates input values correctly", async () => {
    const emailInput = screen.getByTestId("emailField");
    const usernameInput = screen.getByTestId("usernameField");
    const passwordInput = screen.getByTestId("passwordField");
    const confirmPasswordInput = screen.getByTestId("confirmPasswordField");
    const createAccountButton = screen.getByTestId("createAccountButton");

    expect(emailInput.props.value).toStrictEqual("");
    expect(usernameInput.props.value).toStrictEqual("");
    expect(passwordInput.props.value).toStrictEqual("");
    expect(confirmPasswordInput.props.value).toStrictEqual("");
    expect(createAccountButton.props.accessibilityState.disabled).toBe(true);

    await waitFor(() => {
      act(() => {
        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(usernameInput, "coolUserName435");
        fireEvent.changeText(passwordInput, "!Password123");
        fireEvent.changeText(confirmPasswordInput, "!Password123");
      });
    });

    expect(emailInput.props.value).toStrictEqual("test@example.com");
    expect(usernameInput.props.value).toStrictEqual("coolUserName435");
    expect(passwordInput.props.value).toStrictEqual("!Password123");
    expect(confirmPasswordInput.props.value).toStrictEqual("!Password123");
    expect(createAccountButton.props.accessibilityState.disabled).toBe(false);
  });
});
