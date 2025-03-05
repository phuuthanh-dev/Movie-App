import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { TMDB_IMAGE_BASE_URL } from "@env";
import { useNavigation } from "@react-navigation/native";

const CastSection = ({ details }) => {
  const navigation = useNavigation();
  return (
    <>
      <Text style={styles.sectionTitle}>Casts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.castContainer}
      >
        {details.credits?.cast?.slice(0, 10).map((actor) => (
          <TouchableOpacity key={actor.id} style={styles.castItem} onPress={() => navigation.navigate("ActorDetailScreen", { actor })}>
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
            <Text style={styles.character} numberOfLines={1}>
              {actor.character}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default CastSection;

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
    marginRight: 16,
    alignItems: "center",
    width: 80,
  },
  castImage: {
    // width: 60,
    // height: 60,
    // borderRadius: 30,
    width: 80,
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  castName: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#fff",
  },
  character: {
    marginTop: 2,
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#fff",
  },
});
