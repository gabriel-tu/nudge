import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import LoginScreen from "./login";

//this fixes a lot of random errors and I don't know why
jest.useFakeTimers();

describe("LoginScreen", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<LoginScreen />);

    expect(getByTestId("loginTitle")).toBeTruthy();
    expect(getByTestId("emailField")).toBeTruthy();
    expect(getByTestId("passwordField")).toBeTruthy();
  });

  it("updates input values correctly", () => {
    const { getByTestId, unmount } = render(<LoginScreen />);
    const emailInput = getByTestId("emailField");
    const passwordInput = getByTestId("passwordField");

    act(() => {
      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "password123");
    });

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
    // fixes the error "An update to Formik inside a test was not wrapped in act(...)."
    unmount();
  });
});
