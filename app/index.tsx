import { Link } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View>
      home screen!
      <Link href="/screens/profile">go to profile</Link>
      {/* ...other links */}
      <Link href="/screens/welcome">go to welcome</Link>
    </View>
  );
}
