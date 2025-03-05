import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import SpaceComponent from "./../components/SpaceComponent";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { getFavoriteMovies } from "../utils/storage";
import MovieCard from "../components/MovieCard";

const ProfileScreen = ({ navigation }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteMovies();
    }, [])
  );

  const loadFavoriteMovies = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteMovies();
      setFavoriteMovies(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.backdropImage}
            source={require("./../assets/images/background_profile.png")}
          />
          <View style={styles.userContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={styles.userImage}
                source={require("./../assets/images/profile.png")}
              />
              <View style={{ marginLeft: 10, marginTop: 55 }}>
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    color: "white",
                    fontSize: 24
                  }}
                >
                  Phùng Hữu Thành
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "#FFFFFFAD",
                  }}
                >
                  @phuuthanh2003
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === 'android' ? 0 : 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Poppins-Bold",
                        color: "#FFFFFF",
                        fontSize: 12,
                      }}
                    >
                      500
                    </Text>
                    <SpaceComponent width={2} />
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        color: "#FFFFFF",
                        fontSize: 12,
                      }}
                    >
                      Followers
                    </Text>
                  </View>
                  <SpaceComponent width={20} />
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Poppins-Bold",
                        color: "#FFFFFF",
                        fontSize: 12,
                      }}
                    >
                      420
                    </Text>
                    <SpaceComponent width={2} />
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        color: "#FFFFFF",
                        fontSize: 12,
                      }}
                    >
                      Followings
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <SpaceComponent height={20} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={[
              styles.cardContainer,
              {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="calendar" size={10} color="#fff" />
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  color: "#FFFFFF",
                  fontSize: 12,
                }}
              >
                Movies Watched
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                color: "#FFFFFF",
                fontSize: 24,
              }}
            >
              2000
            </Text>
          </View>
          <View
            style={[
              styles.cardContainer,
              {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Fontisto name="clock" size={12} color="#fff" />
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  color: "#FFFFFF",
                  fontSize: 12,
                }}
              >
                Time Spent
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                color: "#FFFFFF",
                fontSize: 24,
              }}
            >
              24m 30d 23h
            </Text>
          </View>
        </View>
        <SpaceComponent height={20} />
        <View>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
            Favorites
          </Text>
          <FlatList
            refreshing={loading}
            onRefresh={loadFavoriteMovies}
            data={favoriteMovies}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieCard
                isShowInfo={false}
                movie={item}
                width={120}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", { movie: item })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#002335",
    paddingTop: Platform.OS === 'android' ? 40 : 0
  },
  container: {
    flex: 1,
    backgroundColor: "#002335",
    paddingHorizontal: 10,
  },
  imageContainer: {
    position: "relative",
    height: 300,
    backgroundColor: "#536975",
    borderRadius: 14,
  },
  cardContainer: {
    backgroundColor: "#536975",
    borderRadius: 14,
    padding: 10,
    flex: 1,
  },
  backdropImage: {
    width: "100%",
    height: "100%",
    marginTop: -24,
    padding: 6,
  },
  userContainer: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    left: 20,
    top: 150,
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 99,
  },
  listContent: {
    paddingVertical: 20,
  },
});
