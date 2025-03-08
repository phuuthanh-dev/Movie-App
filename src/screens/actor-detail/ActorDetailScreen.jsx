import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  TMDB_IMAGE_W200_BASE_URL,
  TMDB_IMAGE_BASE_URL,
  TMDB_IMAGE_ORIGINAL_BASE_URL,
} from "@env";
import { ArrowLeft } from "iconsax-react-native";
import { getActorDetails } from "../../apis/tmdb";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import SpaceComponent from "../../components/SpaceComponent";
import { formatDate } from "../../utils/formatDate";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome } from "@expo/vector-icons";

const ActorDetailScreen = ({ route, navigation }) => {
  const { actor } = route.params;
  const [imageUri, setImageUri] = useState();
  const [actorDetails, setActorDetails] = useState(null);
  const [backdropImage, setBackdropImage] = useState(null);

  useEffect(() => {
    loadActorDetails();
  }, []);

  const loadActorDetails = async () => {
    try {
      const details = await getActorDetails(actor.id);
      setActorDetails(details);

      if (details.movie_credits?.cast) {
        const popularMovie = details.movie_credits.cast
          .sort((a, b) => b.popularity - a.popularity)
          .find((movie) => movie.backdrop_path);

        if (popularMovie) {
          setBackdropImage(popularMovie.backdrop_path);
          setImageUri(
            `${TMDB_IMAGE_W200_BASE_URL}${popularMovie.backdrop_path}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching actor details:", error);
    }
  };

  const openExternalLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (!actorDetails) {
    return null;
  }

  const popularCredits = [
    ...(actorDetails.movie_credits?.cast || []),
    ...(actorDetails.tv_credits?.cast || []),
  ]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.backdropImage}
            source={{
              uri: imageUri,
            }}
            onLoad={() => {
              setImageUri(`${TMDB_IMAGE_ORIGINAL_BASE_URL}${backdropImage}`);
            }}
          />
          <View style={styles.posterContainer}>
            <Image
              style={styles.posterImage}
              source={{
                uri: `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`,
              }}
            />
          </View>
        </View>

        {/* Actor Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{actorDetails.name}</Text>

          {actorDetails.birthday && (
            <Text style={styles.metaInfo}>
              <MaterialCommunityIcons
                name="cake-variant"
                size={16}
                color="#888"
              />
              <SpaceComponent width={7} />
              Born: {formatDate(actorDetails.birthday)}
              {actorDetails.place_of_birth &&
                ` in ${actorDetails.place_of_birth}`}
            </Text>
          )}

          {actorDetails.known_for_department && (
            <Text style={styles.metaInfo}>
              <MaterialCommunityIcons
                name="movie-star"
                size={16}
                color="#888"
              />
              <SpaceComponent width={7} />
              Known for: {actorDetails.known_for_department}
            </Text>
          )}

          {actorDetails.popularity && (
            <Text style={styles.metaInfo}>
              <AntDesign name="star" size={16} color="#888" />
              <SpaceComponent width={7} />
              Popularity: {actorDetails.popularity.toFixed(1)}
            </Text>
          )}

          <Text style={styles.metaInfo}>
            <FontAwesome name="intersex" size={16} color="#888" />
            <SpaceComponent width={7} />
            Gender: {actorDetails.gender === 1 ? "Female" : "Male"}
          </Text>

          {/* Social Media Links */}
          <Text style={styles.sectionTitle}>Social Media</Text>
          {actorDetails.external_ids && (
            <View style={styles.socialLinks}>
              {actorDetails.external_ids.instagram_id && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() =>
                    openExternalLink(
                      `https://instagram.com/${actorDetails.external_ids.instagram_id}`
                    )
                  }
                >
                  <FontAwesome name="instagram" size={24} color="#E1306C" />
                </TouchableOpacity>
              )}
              {actorDetails.external_ids.twitter_id && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() =>
                    openExternalLink(
                      `https://twitter.com/${actorDetails.external_ids.twitter_id}`
                    )
                  }
                >
                  <FontAwesome name="twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
              )}
              {actorDetails.external_ids.facebook_id && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() =>
                    openExternalLink(
                      `https://facebook.com/${actorDetails.external_ids.facebook_id}`
                    )
                  }
                >
                  <FontAwesome name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              )}
              {actorDetails.imdb_id && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() =>
                    openExternalLink(
                      `https://www.imdb.com/name/${actorDetails.external_ids.imdb_id}`
                    )
                  }
                >
                  <FontAwesome name="imdb" size={24} color="#F5C518" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Biography */}
          <View style={styles.biographySection}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text style={styles.biography}>
              {actorDetails.biography || "No biography available."}
            </Text>
          </View>

          {/* Popular Movies & TV Shows */}
          <View style={styles.filmographySection}>
            <Text style={styles.sectionTitle}>Popular Filmography</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularCredits}
              keyExtractor={(item) => `${item.id}-${item.credit_id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.filmographyItem}
                  onPress={() =>
                    navigation.navigate("MovieDetailScreen", {
                      movie: item,
                      mediaType:
                        item.media_type ||
                        (item.first_air_date ? "tv" : "movie"),
                    })
                  }
                >
                  <Image
                    style={styles.filmographyImage}
                    source={{
                      uri: `${TMDB_IMAGE_BASE_URL}${item.poster_path}`,
                    }}
                  />
                  <View style={styles.filmographyInfo}>
                    <Text style={styles.filmographyTitle} numberOfLines={2}>
                      {item.title || item.name}
                    </Text>
                    <Text style={styles.filmographyRole} numberOfLines={1}>
                      as {item.character || "Unknown Role"}
                    </Text>
                    <Text style={styles.filmographyYear}>
                      {new Date(
                        item.release_date || item.first_air_date
                      ).getFullYear() || "TBA"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>
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
  backButtonContainer: {
    position: "absolute",
    top: 40,
    zIndex: 1,
    left: 20,
    backgroundColor: "#C4C4C433",
    borderRadius: 14,
  },
  backButton: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
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
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#fff",
    marginBottom: 12,
  },
  metaInfo: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 12,
    marginTop: 20,
  },
  biography: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#fff",
    lineHeight: 24,
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    backgroundColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filmographySection: {
    marginTop: 24,
  },
  filmographyItem: {
    width: 160,
    marginRight: 16,
  },
  filmographyImage: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginBottom: 8,
  },
  filmographyInfo: {
    padding: 8,
  },
  filmographyTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  filmographyRole: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  filmographyYear: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});

export default ActorDetailScreen;
