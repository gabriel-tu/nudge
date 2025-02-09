import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import LoginScreen from "../screens/login";

//this fixes a lot of random errors and I don't know why
jest.useFakeTimers();

describe("LoginScreen", () => {
  beforeEach(() => {
    render(<LoginScreen />);
  });

  it("renders correctly", () => {
    expect(screen.getByTestId("loginTitle")).toBeTruthy();
    expect(screen.getByTestId("emailField")).toBeTruthy();
    expect(screen.getByTestId("passwordField")).toBeTruthy();
    expect(screen.getByTestId("loginButton")).toBeTruthy();
    expect(screen.getByTestId("signupButton")).toBeTruthy();
  });

  it("updates input values correctly", async () => {
    const emailInput = screen.getByTestId("emailField");
    const passwordInput = screen.getByTestId("passwordField");
    const loginButton = screen.getByTestId("loginButton");
    const emailErrorText = screen.getByTestId("emailErrorText");
    const passwordErrorText = screen.getByTestId("passwordErrorText");

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
