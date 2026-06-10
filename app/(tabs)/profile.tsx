import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Profile</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    alignItems: "center",
  },
});
