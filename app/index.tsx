import { Link } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View>
      home screen!
      <Link href="/screens/profile">go to profile</Link>
      <Link href="/screens/welcome">go to welcome</Link>
      <Link href="/screens/login">go to login</Link>
      <Link href="/screens/signup">go to signup</Link>
    </View>
  );
}
