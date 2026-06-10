import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Activity</Text>
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    alignItems: "center",
  },
});
