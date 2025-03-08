import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { TMDB_IMAGE_BASE_URL, TMDB_IMAGE_W200_BASE_URL } from "@env";

const EpisodeCard = ({ item }) => {
  const [imageUri, setImageUri] = useState(
    `${TMDB_IMAGE_W200_BASE_URL}${item.still_path}`
  );
  return (
    <View style={styles.episodeContainer}>
      <Image
        style={styles.episodeImage}
        source={{
          uri: imageUri,
        }}
        onLoad={() => {
          setImageUri(
            `${TMDB_IMAGE_BASE_URL}${item.still_path}`
          );
        }}
      />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>
          {item.episode_number}. {item.name}
        </Text>
        <Text style={styles.episodeOverview} numberOfLines={1}>
          {item.overview || "No overview available"}
        </Text>
        <Text style={styles.episodeMeta}>
          {new Date(item.air_date).toLocaleDateString()}
          {item.runtime ? ` • ${item.runtime} min` : ""}
        </Text>
      </View>
    </View>
  );
};

export default EpisodeCard;

const styles = StyleSheet.create({
  episodeContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    height: 90,
  },
  notAiredContainer: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#E50914",
  },
  episodeImage: {
    width: 150,
    height: 90,
  },
  episodeInfo: {
    flex: 1,
    padding: 12,
  },
  episodeTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  episodeOverview: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  episodeMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#888",
  },
});
