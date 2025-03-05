import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TMDB_IMAGE_BASE_URL } from "@env";
import { formatDate } from "./../utils/formatDate";
import SpaceComponent from "./SpaceComponent";

const MovieCard = ({ movie, onPress, width, isShowInfo }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width,
          marginBottom: isShowInfo ? 0 : 10,
          marginRight: isShowInfo ? 16 : 10,
        },
      ]}
      onPress={onPress}
    >
      <Image
        style={styles.poster}
        source={{
          uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
        }}
      />
      {isShowInfo && (
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title || movie.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Image
              source={require("../assets/images/cib_imdb.png")}
              style={{ width: 16, height: 16, borderRadius: 5 }}
            />
            <Text style={styles.rating}>
              Rating: {movie.vote_average.toFixed(1)}/10
            </Text>
          </View>
          <SpaceComponent height={2} />
          <Text style={styles.year}>
            {formatDate(movie.release_date || movie.first_air_date)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  poster: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  info: {
    padding: 8,
  },
  title: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: "#e0e0e0",
  },
  year: {
    fontSize: 12,
    color: "#e0e0e0",
  },
});

export default MovieCard;
