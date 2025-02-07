import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "./login";
import { View, TextInput, Text } from "react-native";

jest.mock("react-native-paper", () => {
  const realModule = jest.requireActual("react-native-paper");
  return {
    ...realModule,
    Button: ({
      onPress,
      children,
    }: {
      onPress: () => void;
      children: React.ReactNode;
    }) => (
      <View>
        <Text onPress={onPress}>{children}</Text>
      </View>
    ),
    TextInput: ({
      onChangeText,
      value,
      label,
    }: {
      onChangeText: (text: string) => void;
      value: string;
      label: string;
    }) => (
      <View>
        <Text>{label}</Text>
        <TextInput value={value} onChangeText={onChangeText} />
      </View>
    ),
  };
});

describe("LoginScreen", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText("Login")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  it("updates input values correctly", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("submits the form with valid input", async () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(consoleLogMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    consoleLogMock.mockRestore();
  });
});
