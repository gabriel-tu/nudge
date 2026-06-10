import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { auth } from "../services/config";
import { Nudge, subscribeToNudgeFeed } from "../services/nudges";

const formatTime = (nudge: Nudge) => {
  const date = nudge.createdAt.toDate();
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString();
};

const ActivityScreen = () => {
  const uid = auth.currentUser?.uid;
  const [nudges, setNudges] = useState<Nudge[]>([]);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToNudgeFeed(uid, setNudges);
    return () => unsubscribe();
  }, [uid]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title} testID="activityTitle">
        Activity
      </Text>
      <FlatList
        data={nudges}
        keyExtractor={(nudge) => nudge.id}
        renderItem={({ item: nudge }) => {
          const sentByMe = nudge.fromUid === uid;
          return (
            <List.Item
              title={
                sentByMe
                  ? `You nudged ${nudge.toName}`
                  : `${nudge.fromName} nudged you`
              }
              description={formatTime(nudge)}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={sentByMe ? "hand-pointing-right" : "hand-pointing-left"}
                />
              )}
              testID={`nudgeItem-${nudge.id}`}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText} testID="noActivityText">
            No nudges yet — go nudge a friend!
          </Text>
        }
      />
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  title: {
    marginHorizontal: 16,
    marginBottom: 16,
    fontWeight: "bold",
  },
  emptyText: {
    marginHorizontal: 24,
    marginTop: 16,
    color: "#849491",
  },
});
