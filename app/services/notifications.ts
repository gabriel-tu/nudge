import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { updateUser } from "./users";

export const configureNotificationHandling = () => {
  if (Platform.OS === "web") return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Registers the device for push and saves the Expo push token on the
// user's doc so friends can nudge this device.
export const registerForPushNotifications = async (uid: string) => {
  if (Platform.OS === "web") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("nudges", {
      name: "Nudges",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#83CBC1",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted" || !Device.isDevice) return null;

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  try {
    const token = (
      await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      )
    ).data;
    await updateUser(uid, { expoPushToken: token });
    return token;
  } catch (error) {
    // Expo Go on Android can't fetch push tokens — the app still works,
    // this device just can't receive nudges until a dev build is used.
    console.warn("Could not get a push token:", error);
    return null;
  }
};
