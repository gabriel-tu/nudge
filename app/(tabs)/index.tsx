import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Searchbar, Text } from "react-native-paper";
import { FriendListItem } from "../screens/components/FriendListItem";
import { FriendRequestItem } from "../screens/components/FriendRequestItem";
import { auth } from "../services/config";
import {
  acceptFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from "../services/friends";
import {
  findUserByUsername,
  getUsers,
  NudgeUser,
  subscribeToUser,
} from "../services/users";

const FriendsScreen = () => {
  const uid = auth.currentUser?.uid;
  const [me, setMe] = useState<NudgeUser | null>(null);
  const [friends, setFriends] = useState<NudgeUser[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<NudgeUser[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [foundUser, setFoundUser] = useState<NudgeUser | null>(null);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToUser(uid, async (user) => {
      setMe(user);
      if (user) {
        const [friendUsers, requestUsers] = await Promise.all([
          getUsers(user.friends),
          getUsers(user.incomingFriendRequests),
        ]);
        setFriends(friendUsers);
        setIncomingRequests(requestUsers);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const searchForUser = async () => {
    const userName = searchText.trim();
    setFoundUser(null);
    setSearchMessage("");
    if (!userName || !me) return;

    const result = await findUserByUsername(userName);
    if (!result) {
      setSearchMessage(`No user found named "${userName}"`);
    } else if (result.uid === me.uid) {
      setSearchMessage("That's you!");
    } else if (me.friends.includes(result.uid)) {
      setSearchMessage(`You are already friends with ${result.userName}`);
    } else if (me.outgoingFriendRequests.includes(result.uid)) {
      setSearchMessage(`You already sent ${result.userName} a request`);
    } else if (me.incomingFriendRequests.includes(result.uid)) {
      setSearchMessage(
        `${result.userName} already sent you a request — accept it below!`
      );
    } else {
      setFoundUser(result);
    }
  };

  const sendRequest = async () => {
    if (!me || !foundUser) return;
    await sendFriendRequest(me.uid, foundUser.uid);
    setSearchMessage(`Request sent to ${foundUser.userName}`);
    setFoundUser(null);
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title} testID="friendsTitle">
        Friends
      </Text>
      <Searchbar
        placeholder="Add a friend by username"
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setSearchMessage("");
          setFoundUser(null);
        }}
        onSubmitEditing={searchForUser}
        onIconPress={searchForUser}
        style={styles.searchBar}
        testID="addFriendSearchBar"
      />
      {searchMessage ? (
        <Text style={styles.searchMessage} testID="searchMessage">
          {searchMessage}
        </Text>
      ) : null}
      {foundUser ? (
        <View style={styles.foundUserContainer} testID="foundUserRow">
          <Text variant="bodyLarge" style={styles.foundUserName}>
            {foundUser.userName}
          </Text>
          <Button
            mode="contained"
            onPress={sendRequest}
            testID="sendRequestButton"
          >
            Send request
          </Button>
        </View>
      ) : null}

      {incomingRequests.length > 0 ? (
        <View>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Friend requests
          </Text>
          {incomingRequests.map((requester) => (
            <FriendRequestItem
              key={requester.uid}
              name={requester.userName}
              photoBase64={requester.photoBase64}
              onAccept={() => me && acceptFriendRequest(me.uid, requester.uid)}
              onDecline={() =>
                me && declineFriendRequest(me.uid, requester.uid)
              }
              testID={`friendRequest-${requester.userName}`}
            />
          ))}
        </View>
      ) : null}

      <FlatList
        data={friends}
        keyExtractor={(friend) => friend.uid}
        renderItem={({ item: friend }) => (
          <FriendListItem
            name={friend.userName}
            photoBase64={friend.photoBase64}
            lastNudged={me?.nudgeTimes?.[friend.uid]}
            onPress={() => router.push(`/screens/friend/${friend.uid}`)}
            testID={`friendItem-${friend.userName}`}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText} testID="noFriendsText">
            No friends yet — search a username above to add one!
          </Text>
        }
      />
    </View>
  );
};

export default FriendsScreen;

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
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchMessage: {
    marginHorizontal: 24,
    marginBottom: 8,
    color: "#2E4961",
  },
  foundUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 8,
  },
  foundUserName: {
    fontWeight: "bold",
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptyText: {
    marginHorizontal: 24,
    marginTop: 16,
    color: "#849491",
  },
});
