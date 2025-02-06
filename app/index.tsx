import { Link } from "expo-router";
import { View } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export default function Index() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#83CBC1",
      secondary: "#849491",
    },
  };

  return (
    <PaperProvider>
      <View>
        home screen!
        <Link href="/screens/profile">go to profile</Link>
        {/* ...other links */}
        <Link href="/screens/welcome">go to welcome</Link>
      </View>
    </PaperProvider>
  );
}
