import { StyleSheet, View } from "react-native";
import { Avatar, Card, IconButton, Text } from "react-native-paper";

const defaultProfilePicture = require("../../../assets/images/default-profile-picture.png");

interface Props {
  name: string;
  photoBase64?: string;
  onAccept: () => void;
  onDecline: () => void;
  testID?: string;
}

export const FriendRequestItem = (props: Props) => {
  return (
    <Card style={styles.card} testID={props.testID}>
      <View style={styles.container}>
        <Avatar.Image
          style={styles.imageContainer}
          size={40}
          source={
            props.photoBase64
              ? { uri: `data:image/jpeg;base64,${props.photoBase64}` }
              : defaultProfilePicture
          }
        />
        <Text variant="bodyLarge" style={styles.nameText}>
          {props.name}
        </Text>
        <View style={styles.actionsContainer}>
          <IconButton
            icon="check"
            mode="contained"
            size={20}
            onPress={props.onAccept}
            testID={props.testID ? `${props.testID}AcceptButton` : undefined}
          />
          <IconButton
            icon="close"
            size={20}
            onPress={props.onDecline}
            testID={props.testID ? `${props.testID}DeclineButton` : undefined}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    margin: 12,
  },
  nameText: {
    fontWeight: "bold",
    flexShrink: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 8,
  },
});
