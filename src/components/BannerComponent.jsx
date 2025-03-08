import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { TMDB_IMAGE_ORIGINAL_BASE_URL, TMDB_IMAGE_W200_BASE_URL } from "@env";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatDate } from "../utils/formatDate";
import { useNavigation } from "@react-navigation/native";

const BannerComponent = ({ item }) => {
  const [imageUri, setImageUri] = useState(
    `${TMDB_IMAGE_W200_BASE_URL}${item.backdrop_path}`
  );
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MovieDetailScreen", { movie: item })}
      style={styles.bannerContainer}
    >
      {/* Low-Res Image First */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffca45" />
        </View>
      )}

      <Image
        source={{ uri: imageUri }}
        style={styles.bannerImage}
        onLoad={() => {
          setImageUri(`${TMDB_IMAGE_ORIGINAL_BASE_URL}${item.backdrop_path}`);
          setLoading(false);
        }}
      />

      <View style={styles.bannerGradient}>
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle} numberOfLines={1}>
            {item.title || item.name}
          </Text>
          <View style={styles.bannerMetaInfo}>
            <Text style={styles.bannerRating}>⭐ {item.vote_average.toFixed(1)}/10</Text>
            <Text style={{ color: "#fff", marginHorizontal: 10 }}>
              <AntDesign name="minus" size={14} color="#fff" />
            </Text>
            <MaterialCommunityIcons name="calendar-clock" size={14} color="#fff" />
            <Text style={styles.releaseDate}>{formatDate(item.release_date)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  bannerContainer: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "flex-end",
  },
  bannerInfo: {
    marginBottom: 10,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bannerMetaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerRating: {
    color: "#ffca45",
  },
  releaseDate: {
    color: "#fff",
    marginLeft: 5,
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

export default BannerComponent;
