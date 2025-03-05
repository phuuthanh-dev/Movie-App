import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { TMDB_IMAGE_BASE_URL } from "@env";

const ActorCard = ({ actor, onPress }) => {
  return (
    <TouchableOpacity style={styles.castItem} onPress={onPress}>
      <Image
        style={styles.castImage}
        source={{
          uri: actor.profile_path
            ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
            : "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
        }}
      />
      <Text style={styles.castName} numberOfLines={1}>
        {actor.name}
      </Text>
    </TouchableOpacity>
  );
};

export default ActorCard;

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
  },
  castContainer: {
    marginBottom: 24,
  },
  castItem: {
    marginRight: 13,
    alignItems: "center",
    width: 120,
    padding: 4,
    backgroundColor: "#536975",
    borderRadius: 6,
    marginBottom: 10,
  },
  castImage: {
    width: "100%",
    height: 160,
    borderRadius: 6,
  },
  castName: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#fff",
    marginVertical: 4,
  },
});
