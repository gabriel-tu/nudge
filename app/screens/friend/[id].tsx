import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Avatar, IconButton, Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { formatLastNudged } from "../components/FriendListItem";
import { auth } from "../../services/config";
import { getCooldownRemaining, sendNudge } from "../../services/nudges";
import { NudgeUser, subscribeToUser } from "../../services/users";

const defaultProfilePicture = require("../../../assets/images/default-profile-picture.png");

const FriendScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const uid = auth.currentUser?.uid;
  const theme = useTheme();
  const [me, setMe] = useState<NudgeUser | null>(null);
  const [friend, setFriend] = useState<NudgeUser | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToUser(uid, setMe);
    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToUser(id, setFriend);
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!me || !id) return;
    setCooldown(getCooldownRemaining(me, id));
    const interval = setInterval(
      () => setCooldown(getCooldownRemaining(me, id)),
      500
    );
    return () => clearInterval(interval);
  }, [me, id]);

  const shakeOffset = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const shakeButton = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const nudge = async () => {
    if (!me || !friend || cooldown > 0 || sending) return;
    setSending(true);
    try {
      await sendNudge(me, friend);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      shakeButton();
    } finally {
      setSending(false);
    }
  };

  const onCooldown = cooldown > 0;
  const lastNudged = id ? me?.nudgeTimes?.[id] : undefined;

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        style={styles.backButton}
        onPress={() => router.back()}
        testID="backButton"
      />
      <View style={styles.content}>
        <Avatar.Image
          size={96}
          source={
            friend?.photoBase64
              ? { uri: `data:image/jpeg;base64,${friend.photoBase64}` }
              : defaultProfilePicture
          }
          testID="friendAvatar"
        />
        <Text variant="headlineMedium" style={styles.name} testID="friendName">
          {friend?.userName ?? ""}
        </Text>
        <Animated.View style={shakeStyle}>
          <Pressable
            style={({ pressed }) => [
              styles.nudgeButton,
              {
                backgroundColor: onCooldown
                  ? theme.colors.secondary
                  : theme.colors.primary,
              },
              pressed && !onCooldown ? styles.nudgeButtonPressed : null,
            ]}
            onPress={nudge}
            disabled={onCooldown || sending}
            testID="nudgeButton"
          >
            <Text variant="headlineLarge" style={styles.nudgeButtonText}>
              {onCooldown ? `${cooldown}` : "NUDGE"}
            </Text>
          </Pressable>
        </Animated.View>
        <Text variant="bodyMedium" style={styles.lastNudgedText} testID="lastNudgedText">
          {formatLastNudged(lastNudged)}
        </Text>
        {friend && !friend.expoPushToken ? (
          <Text variant="bodySmall" style={styles.noTokenText} testID="noTokenText">
            {friend.userName} can't receive notifications yet — their nudges
            will still show in Activity
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  backButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
  },
  name: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 48,
  },
  nudgeButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  nudgeButtonPressed: {
    opacity: 0.8,
  },
  nudgeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    userSelect: "none",
  },
  lastNudgedText: {
    marginTop: 32,
    color: "#2E4961",
  },
  noTokenText: {
    marginTop: 8,
    marginHorizontal: 32,
    textAlign: "center",
    color: "#849491",
  },
});
