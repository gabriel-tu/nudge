import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Index() {
  return (
    <View>
      <Text>home screen!</Text>
      <Link href="/screens/profile">go to profile</Link>
      <Link href="/screens/welcome">go to welcome</Link>
      <Link href="/screens/login">go to login</Link>
    </View>
  );
}
