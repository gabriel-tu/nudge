import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import SignupScreen from "../screens/signup";

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
    const passwordInput = screen.getByTestId("passwordField");
    const loginButton = screen.getByTestId("loginButton");

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
});
