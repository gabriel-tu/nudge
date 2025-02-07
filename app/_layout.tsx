import { Stack } from "expo-router";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  //TODO: add all our themes colours
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#83CBC1",
      secondary: "#849491",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {" "}
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="login" />
      </Stack>
    </PaperProvider>
  );
}
