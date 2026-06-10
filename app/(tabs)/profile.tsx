import { router } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { auth } from "../services/config";
import { NudgeUser, subscribeToUser, updateUser } from "../services/users";

const defaultProfilePicture = require("../../assets/images/default-profile-picture.png");

// Keep well under Firestore's 1MB document limit.
const MAX_PHOTO_BASE64_LENGTH = 700_000;

const ProfileScreen = () => {
  const uid = auth.currentUser?.uid;
  const [me, setMe] = useState<NudgeUser | null>(null);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToUser(uid, setMe);
    return () => unsubscribe();
  }, [uid]);

  const changeProfilePicture = async () => {
    setPhotoError("");
    const pickResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (pickResult.canceled || !uid) return;

    const resized = await ImageManipulator.manipulateAsync(
      pickResult.assets[0].uri,
      [{ resize: { width: 200, height: 200 } }],
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );
    if (!resized.base64 || resized.base64.length > MAX_PHOTO_BASE64_LENGTH) {
      setPhotoError("That image is too large, please pick another one");
      return;
    }
    await updateUser(uid, { photoBase64: resized.base64 });
  };

  const signOut = () => {
    auth.signOut().then(() => {
      router.replace("/screens/login");
    });
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={120}
        style={styles.avatar}
        source={
          me?.photoBase64
            ? { uri: `data:image/jpeg;base64,${me.photoBase64}` }
            : defaultProfilePicture
        }
        testID="profileAvatar"
      />
      <Text variant="headlineMedium" style={styles.userName} testID="profileUserName">
        {me?.userName ?? ""}
      </Text>
      <Text variant="bodyMedium" style={styles.email} testID="profileEmail">
        {auth.currentUser?.email ?? ""}
      </Text>
      {photoError ? (
        <Text style={styles.photoError} testID="photoErrorText">
          {photoError}
        </Text>
      ) : null}
      <Button
        mode="contained"
        style={styles.button}
        onPress={changeProfilePicture}
        testID="changePictureButton"
      >
        Change picture
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={signOut}
        testID="signOutButton"
      >
        Sign out
      </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    fontWeight: "bold",
  },
  email: {
    color: "#849491",
    marginBottom: 24,
  },
  photoError: {
    color: "#B3261E",
    marginBottom: 8,
  },
  button: {
    width: 220,
    marginBottom: 12,
  },
});
