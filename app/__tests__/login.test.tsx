import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import LoginScreen from "../screens/login";
import { ReactTestInstance } from "react-test-renderer";

// mock dependencies
jest.mock("firebase/auth");
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
  let emailInput: ReactTestInstance,
    passwordInput: ReactTestInstance,
    loginButton: ReactTestInstance,
    emailErrorText: ReactTestInstance,
    passwordErrorText: ReactTestInstance,
    showPasswordButton: ReactTestInstance;

  beforeEach(() => {
    render(<LoginScreen />);
    emailInput = screen.getByTestId("emailField");
    passwordInput = screen.getByTestId("passwordField");
    loginButton = screen.getByTestId("loginButton");
    emailErrorText = screen.getByTestId("emailErrorText");
    passwordErrorText = screen.getByTestId("passwordErrorText");
    showPasswordButton = screen.getByTestId("showPasswordButton");
  });

  it("renders correctly", () => {
    expect(screen.getByTestId("loginTitle")).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
    expect(passwordErrorText).toBeTruthy();
  });

  it("updates input values correctly", async () => {
    expect(emailInput.props.value).toStrictEqual("");
    expect(passwordInput.props.value).toStrictEqual("");
    expect(loginButton.props.accessibilityState.disabled).toBe(true);

    await waitFor(() => {
      act(() => {
        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(passwordInput, "password123");
      });
    });

    expect(emailInput.props.value).toStrictEqual("test@example.com");
    expect(passwordInput.props.value).toStrictEqual("password123");
    expect(loginButton.props.accessibilityState.disabled).toBe(false);
  });

  it("when show password button is pressed, password is visible", async () => {
    expect(passwordInput.props.secureTextEntry).toBe(true);

    await waitFor(() => {
      act(() => {
        fireEvent.press(showPasswordButton);
      });
    });

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
