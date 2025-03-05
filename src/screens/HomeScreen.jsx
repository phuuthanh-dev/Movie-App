import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import SpaceComponent from "../components/SpaceComponent";
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getTVSeriesTopRated,
} from "../apis/tmdb";
import MovieCard from "../components/MovieCard";
import Carousel from "react-native-snap-carousel";
import { TMDB_IMAGE_ORIGINAL_BASE_URL } from "@env";
import { formatDate } from "../utils/formatDate";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import BannerComponent from "../components/BannerComponent";

const HomeScreen = ({ navigation }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [TVSeriesTopRated, setTVSeriesTopRated] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { width: screenWidth } = Dimensions.get("window");
  // const [imageUri, setImageUri] = useState(`https://image.tmdb.org/t/p/w200${item.backdrop_path}`);

  useEffect(() => {
    loadTrendingMovies();
    loadTopRatedMovies();
    loadNowPlayingMovies();
    loadTVSeriesTopRated();
  }, []);

  const loadTrendingMovies = async () => {
    setIsLoaded(true);
    try {
      const data = await getTrendingMovies();
      setTrendingMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(false);
    }
  };

  const loadTopRatedMovies = async () => {
    setIsLoaded(true);
    try {
      const data = await getTopRatedMovies();
      setTopRatedMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(false);
    }
  };

  const loadNowPlayingMovies = async () => {
    setIsLoaded(true);
    try {
      const data = await getNowPlayingMovies();
      setNowPlayingMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(false);
    }
  };

  const loadTVSeriesTopRated = async () => {
    setIsLoaded(true);
    try {
      const data = await getTVSeriesTopRated();
      setTVSeriesTopRated(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(false);
    }
  };

  const renderBannerItem = ({ item }) => <BannerComponent item={item} navigation={navigation} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{
          padding: 10,
          flex: 1,
          backgroundColor: "#002335",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/LOGO.png")}
            style={{ width: 50, height: 50 }}
          />
          <Text
            style={{
              fontFamily: "Khand-Medium",
              fontSize: 30,
              color: "#fff",
              marginLeft: 5,
            }}
          >
            CINEPHILER
          </Text>
        </View>
        <SpaceComponent height={30} />
        <View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 30,
                color: "#fff",
              }}
            >
              Welcome back,{" "}
              <Text style={{ color: "#ffca45" }}>Phùng Thành!</Text>
            </Text>
          </View>
          <Text style={{ color: "white" }}>
            Review or log film you've watched...
          </Text>
        </View>
        <View style={{ marginLeft: -10 }}>
          <Carousel
            data={trendingMovies.slice(0, 5)}
            renderItem={renderBannerItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth - 20}
            loop={true}
            autoplay={true}
            autoplayInterval={5000}
            containerCustomStyle={styles.carouselContainer}
            removeClippedSubviews={true} 
          />
        </View>

        <View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Now Playing
          </Text>
          <FlatList
            onRefresh={loadNowPlayingMovies}
            refreshing={isLoaded}
            data={nowPlayingMovies}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieCard
                width={140}
                isShowInfo={true}
                movie={item}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", {
                    movie: item,
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Trending
          </Text>
          <FlatList
            onRefresh={loadTrendingMovies}
            refreshing={isLoaded}
            data={trendingMovies}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieCard
                width={140}
                isShowInfo={true}
                movie={item}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", {
                    movie: item,
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            contentContainerStyle={styles.listContent}
          />
        </View>
        <View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            TV Series
          </Text>
          <FlatList
            onRefresh={loadTVSeriesTopRated}
            refreshing={isLoaded}
            data={TVSeriesTopRated}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                isShowInfo={true}
                width={140}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", {
                    movie: item,
                    mediaType: "tv",
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Top Rated
          </Text>
          <FlatList
            onRefresh={loadTopRatedMovies}
            refreshing={isLoaded}
            data={topRatedMovies}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                isShowInfo={true}
                width={140}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", {
                    movie: item,
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            contentContainerStyle={styles.listContent}
          />
        </View>
        <SpaceComponent height={100} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#002335",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 20,
  },
  searchButton: {
    marginRight: 16,
  },
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
    fontWeight: "Poppins-Bold",
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
  carouselContainer: {
    marginVertical: 20,
  },
});

export default HomeScreen;
