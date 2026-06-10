import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const FriendScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text>Friend page for {id} (coming soon)</Text>
    </View>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
