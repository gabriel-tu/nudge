import { getAuth } from "firebase/auth";
import { Text, View } from "react-native";
import { app } from "../services/config";
import { Button } from "react-native-paper";
import { router } from "expo-router";

const auth = getAuth(app);

const WelcomeScreen = () => {
  return (
    <View>
      <Text>
        welcome{auth.currentUser ? " " + auth.currentUser.email : ""}!
      </Text>
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
      ) : (
        ""
      )}
    </View>
  );
};

export default WelcomeScreen;
