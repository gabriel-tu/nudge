import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Platform } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { auth } from "./services/config";
import {
  configureNotificationHandling,
  registerForPushNotifications,
} from "./services/notifications";

configureNotificationHandling();

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

  // MSN-style full screen shake when a nudge arrives while the app is open
  const shakeOffset = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        registerForPushNotifications(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = Notifications.addNotificationReceivedListener(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      shakeOffset.value = withSequence(
        withTiming(-14, { duration: 50 }),
        withTiming(14, { duration: 50 }),
        withTiming(-14, { duration: 50 }),
        withTiming(14, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    });
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Animated.View style={[{ flex: 1 }, shakeStyle]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="screens/login" />
          <Stack.Screen name="screens/signup" />
          <Stack.Screen name="screens/friend/[id]" />
        </Stack>
      </Animated.View>
    </PaperProvider>
  );
}
