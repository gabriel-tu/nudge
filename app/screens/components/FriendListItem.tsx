import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

interface props {
  image: any; //TODO: figure out images
  name: string;
  lastNudged: any; //TODO: do we want to use a string or date
}

export const FriendListItem = (props: props) => {
  return (
    <Card style={{ width: 400 }}>
      <View style={styles.container}>
        <Avatar.Image
          style={styles.imageContainer}
          size={56}
          source={props.image}
        />

        <View style={styles.textContainer}>
          <Text variant="bodyLarge" style={styles.nameText}>
            {props.name}
          </Text>
          <Text variant="bodySmall" style={styles.lastNudgedText}>
            {props.lastNudged}
          </Text>
        </View>
        <Button style={styles.buttonContainer} mode="contained">
          nudge
        </Button>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
  },
  nameText: {
    fontWeight: "bold",
  },
  lastNudgedText: {
    color: "#2E4961",
  },
});
