import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const FriendsScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Friends</Text>
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    alignItems: "center",
  },
});
