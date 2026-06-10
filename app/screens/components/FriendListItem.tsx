import { Timestamp } from "firebase/firestore";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

const defaultProfilePicture = require("../../../assets/images/default-profile-picture.png");

interface Props {
  name: string;
  photoBase64?: string;
  lastNudged?: Timestamp;
  onPress?: () => void;
  testID?: string;
}

export const formatLastNudged = (lastNudged?: Timestamp) => {
  if (!lastNudged) return "Never nudged";
  const date = lastNudged.toDate();
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? `Last nudged at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : `Last nudged ${date.toLocaleDateString()}`;
};

export const FriendListItem = (props: Props) => {
  return (
    <Card style={styles.card} onPress={props.onPress} testID={props.testID}>
      <View style={styles.container}>
        <Avatar.Image
          style={styles.imageContainer}
          size={56}
          source={
            props.photoBase64
              ? { uri: `data:image/jpeg;base64,${props.photoBase64}` }
              : defaultProfilePicture
          }
        />

        <View style={styles.textContainer}>
          <Text variant="bodyLarge" style={styles.nameText}>
            {props.name}
          </Text>
          <Text variant="bodySmall" style={styles.lastNudgedText}>
            {formatLastNudged(props.lastNudged)}
          </Text>
        </View>
        <Button
          style={styles.buttonContainer}
          mode="contained"
          onPress={props.onPress}
          testID={props.testID ? `${props.testID}NudgeButton` : undefined}
        >
          nudge
        </Button>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  container: {
    display: "flex",
    flexDirection: "row",
  },
  imageContainer: {
    margin: 16,
  },
  buttonContainer: {
    width: 88,
    height: 32,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: "auto",
    marginRight: 16,
  },
  textContainer: {
    justifyContent: "center",
    flexShrink: 1,
  },
  nameText: {
    fontWeight: "bold",
  },
  lastNudgedText: {
    color: "#2E4961",
  },
});
