import React, { useState, useEffect, Fragment } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TMDB_IMAGE_W200_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_IMAGE_ORIGINAL_BASE_URL } from "@env";
import {
  getMovieDetails,
  getMovieReviews,
  getMovieVideos,
  getMovieWatchProviders,
} from "../../apis/tmdb";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SpaceComponent from "../../components/SpaceComponent";
import { ArrowLeft } from "iconsax-react-native";
import { getFavoriteMovies, toggleFavorite } from "../../utils/storage";
import WebView from "react-native-webview";
import ChartRating from "../../components/ChartRating";
import ReviewSection from "./components/ReviewSection";
import AntDesign from "@expo/vector-icons/AntDesign";
import CastSection from "./components/CastSection";
import Fontisto from "@expo/vector-icons/Fontisto";

const MovieDetailScreen = ({ route, navigation }) => {
  const { movie, mediaType } = route.params;
  const [imageUri, setImageUri] = useState(
    `${TMDB_IMAGE_W200_BASE_URL}${movie.backdrop_path}`
  );
  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [trailerVisible, setTrailerVisible] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);

  useEffect(() => {
    loadMovieDetails();
    checkFavoriteStatus();
    loadMovieReviews();
    loadWatchProviders();
  }, []);

  const loadMovieDetails = async () => {
    try {
      const [detailsData, videosData] = await Promise.all([
        getMovieDetails(movie.id, mediaType),
        getMovieVideos(movie.id, mediaType),
      ]);
      setDetails(detailsData);
      setVideos(videosData);
    } catch (error) {
      console.error(error);
    }
  };

  const checkFavoriteStatus = async () => {
    const favorites = await getFavoriteMovies();
    setIsFavorite(favorites.some((fav) => fav.id === movie.id));
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(movie);
    setIsFavorite(!isFavorite);
  };

  const loadMovieReviews = async () => {
    const reviews = await getMovieReviews(movie.id, mediaType);
    setReviews(reviews);
  };

  const handleTrailerPress = () => {
    // Find official trailer or first video
    const trailer =
      videos.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          video.official === true
      ) || videos.find((video) => video.site === "YouTube");

    if (trailer) {
      setTrailerKey(trailer.key);
      setTrailerVisible(true);
    } else {
      // You might want to show an alert or message if no trailer is available
      Alert.alert("No Trailer", "No trailer available for this movie.");
    }
  };

  // Add this component for the trailer modal
  const TrailerModal = () => (
    <Modal
      visible={trailerVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setTrailerVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setTrailerVisible(false)}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <WebView
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{
              uri: `https://www.youtube.com/embed/${trailerKey}?rel=0&autoplay=1`,
            }}
          />
        </View>
      </View>
    </Modal>
  );

  const loadWatchProviders = async () => {
    try {
      const providers = await getMovieWatchProviders(movie.id, mediaType);
      setWatchProviders(providers);
    } catch (error) {
      console.error(error);
    }
  };

  // Add new function to handle watch movie
  const handleWatchMovie = () => {
    if (watchProviders && watchProviders.US && watchProviders.US.link) {
      navigation.navigate("WatchMovieScreen", {
        movieUrl: watchProviders.US.link,
        title: movie.title,
      });
    } else {
      Alert.alert(
        "Not Available",
        "This movie is not currently available for streaming in your region."
      );
    }
  };

  if (!details) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Backdrop Image */}
        <View
          style={{
            position: "absolute",
            top: 40,
            zIndex: 1,
            left: 20,
            backgroundColor: "#C4C4C433",
            borderRadius: 14,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 54,
              height: 54,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.backdropImage}
            source={{
              uri: imageUri,
            }}
            onLoad={() => {
              setImageUri(`${TMDB_IMAGE_ORIGINAL_BASE_URL}${movie.backdrop_path}`);
            }}
          />
          <View style={styles.posterContainer}>
            <Image
              style={styles.posterImage}
              source={{
                uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
              }}
            />
          </View>
        </View>

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title || movie.name}</Text>

          <Text style={styles.director}>
            <MaterialCommunityIcons
              name="movie-open-star"
              size={16}
              color="#888"
            />
            <SpaceComponent width={7} />
            {mediaType === "tv"
              ? `Published by ${details.production_companies[0].name}`
              : `Directed by ${
                  details.credits?.crew?.find((c) => c.job === "Director")
                    ?.name || "Unknown"
                }`}
          </Text>

          {/* Genre Info */}
          <View style={styles.genreInfo}>
            <Fontisto name="film" size={16} color="#888" />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={details.genres}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <Text style={styles.genreText}>
                  {item.name}
                  {index !== details.genres.length - 1 && "  -"}
                </Text>
              )}
            />
          </View>

          {details.tagline && (
            <Text style={styles.director}>
              <AntDesign name="tagso" size={16} color="#888" />
              <SpaceComponent width={7} />
              {details.tagline}
            </Text>
          )}

          {/* Movie Meta Info */}
          <View style={styles.metaInfo}>
            {mediaType === "tv" ? (
              <>
                <MaterialIcons name="local-movies" size={16} color="#888" />
                <Text style={styles.metaText}>
                  {details.runtime
                    ? `${Math.floor(details.runtime / 60)}h ${
                        details.runtime % 60
                      }m`
                    : details.number_of_episodes}
                  {mediaType === "tv" ? " episodes" : ""}
                </Text>

                <Text style={styles.metaText}> • </Text>
                <MaterialCommunityIcons
                  name="movie-open"
                  size={16}
                  color="#888"
                />
                <Text style={styles.metaText}>
                  {details.number_of_seasons} seasons
                </Text>
              </>
            ) : (
              <>
                <Icon name="time-outline" size={16} color="#888" />
                <Text style={styles.metaText}>
                  {details.runtime
                    ? `${Math.floor(details.runtime / 60)}h ${
                        details.runtime % 60
                      }m`
                    : details.number_of_episodes}
                  {mediaType === "tv" ? " episodes" : ""}
                </Text>
              </>
            )}

            <Text style={styles.metaText}> • </Text>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={16}
              color="#888"
            />
            <Text style={styles.metaText}>
              {new Date(
                movie.release_date || movie.first_air_date
              ).toLocaleDateString()}
            </Text>

            {!(mediaType === "tv") && (
              <>
                <Text style={styles.metaText}> • </Text>
                <Entypo name="eye" size={16} color="#888" />
                <Text style={styles.watchStatus}>Not Watched</Text>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.actionButtons}
          >
            <TouchableOpacity
              style={styles.watchButton}
              onPress={handleWatchMovie}
            >
              <Icon name="play-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Watch Movie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.trailerButton}
              onPress={handleTrailerPress}
            >
              <Icon name="play" size={20} color="#fff" />
              <Text style={styles.buttonText}>Watch Trailer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.wishlistButton}
              onPress={handleToggleFavorite}
            >
              {isFavorite ? (
                <>
                  <MaterialIcons
                    name="bookmark-remove"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>Remove from Wishlist</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="bookmark-add" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Add to Wishlist</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logButton}>
              <MaterialIcons name="add-circle" size={24} color="black" />
              <Text style={styles.logButtonText}>Log</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Overview */}
          <Text style={styles.overview}>{movie.overview}</Text>

          {/* Cast Section */}
          <CastSection details={details} />

          {/* Ratings Section */}
          <Text style={styles.sectionTitle}>Ratings</Text>
          <View style={styles.ratingsContainer}>
            <View style={styles.ratingBar}>
              <ChartRating
                totalRating={details.vote_count}
                rating={`${details.vote_average.toFixed(1)}/10`}
              />
            </View>
          </View>

          {/* Reviews Section */}
          <ReviewSection reviews={reviews} />
        </View>
      </ScrollView>

      {/* Add the trailer modal */}
      <TrailerModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  posterContainer: {
    position: "absolute",
    left: 20,
    bottom: -50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  posterImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#fff",
    marginBottom: 4,
  },
  director: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  genreInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  genreText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#888",
    marginLeft: Platform.OS === "android" ? 7 : 4,
  },
  metaText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#888",
    marginHorizontal: 4,
  },
  watchStatus: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#888",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 24,
  },
  trailerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  logButton: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginLeft: 8,
  },
  logButtonText: {
    fontFamily: "Poppins-Bold",
    color: "#000",
    marginLeft: 4,
  },
  overview: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#fff",
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
  },
  ratingsContainer: {
    marginBottom: 24,
  },
  ratingBar: {
    backgroundColor: "#333",
    borderRadius: 20,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  ratingText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#888",
  },
  // Trailer Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -40,
    right: 10,
    zIndex: 2,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  watchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E50914",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
});

export default MovieDetailScreen;
