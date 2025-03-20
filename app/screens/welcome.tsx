import { Text, View } from "react-native";
import { auth } from "../services/config";
import { Button } from "react-native-paper";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { FriendListItem } from "./components/FriendListItem";

const WelcomeScreen = () => {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        console.log(user.email);
        setEmail(user.email);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>{email ? `Welcome ${email}!` : "Welcome!"}</Text>
      {auth.currentUser ? (
        <Button
          onPress={() => {
            auth.signOut().then(() => {
              router.push("/screens/login");
            });
          }}
        >
          Sign out
        </Button>
      ) : null}
      <FriendListItem
        image={require("../../assets/images/default-profile-picture.png")} //TODO: figure out images
        name="Johhny Chau"
        lastNudged="10:23am"
      />
    </View>
  );
};

export default WelcomeScreen;
