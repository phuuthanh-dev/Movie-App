import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { getPopularActors, getPopularMovies, searchMovies } from "../apis/tmdb";
import SpaceComponent from "../components/SpaceComponent";
import ActorCard from "../components/ActorCard";

const SearchScreen = ({ navigation }) => {
  const tabs = [
    { key: "movie", label: "Movie" },
    { key: "actor", label: "Actor" },
    { key: "tv", label: "TV" },
    { key: "company", label: "Company" },
  ];
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedTab, setSelectedTab] = useState("movie");

  // Debounce Effect
  useEffect(() => {
    if (query.trim() === "") {
      loadPopularMovies();
    } else {
      const delayDebounce = setTimeout(() => {
        if (query.trim() !== "") {
          handleSearch();
        }
      }, 1000);

      return () => clearTimeout(delayDebounce);
    }
  }, [query]);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  useEffect(() => {
    handleGetData();
  }, [selectedTab]);

  const handleGetData = async () => {
    setLoading(true);
    try {
      let data = [];
      switch (selectedTab) {
        case "movie":
          data = await getPopularMovies();
          setTitle("Popular Movies");
          break;
        case "actor":
          data = await getPopularActors();
          setActors(data);
          setTitle("Popular Actors");
          break;
        case "tv":
          setTitle("Popular TV Shows");
          break;
        case "company":
          setTitle("Popular Companies");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const data = await getPopularMovies();
      const filteredMovies = data.filter((movie) => movie.poster_path);
      setMovies(filteredMovies);
      setTitle("Popular Movies");
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await searchMovies(query);
      const filteredMovies = results.filter((movie) => movie.poster_path);
      setMovies(filteredMovies);
      setTitle("Search Results");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <>
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  selectedTab === tab.key && styles.activeTabButton,
                ]}
                onPress={() => setSelectedTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.title}>{title}</Text>
          {selectedTab === "movie" && (
            <FlatList
              data={movies}
              renderItem={({ item }) => {
                return (
                  <MovieCard
                    movie={item}
                    width={120}
                    isShowInfo={false}
                    onPress={() =>
                      navigation.navigate("MovieDetailScreen", { movie: item })
                    }
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              ListFooterComponent={<SpaceComponent height={70} />}
            />
          )}
          {selectedTab === "actor" && (
            <FlatList
              data={actors}
              renderItem={({ item }) => {
                return (
                  <ActorCard
                    actor={item}
                    onPress={() =>
                      navigation.navigate("ActorDetailScreen", { actor: item })
                    }
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              ListFooterComponent={<SpaceComponent height={70} />}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#002335",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  columnWrapper: {
    justifyContent: "space-start",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },

  // Tab
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#ffca45",
  },
  tabText: {
    fontFamily: "Poppins-Regular",
    color: "#fff",
    fontSize: 20,
  },
  activeTabText: {
    fontFamily: "Poppins-Bold",
    color: "#ffca45",
  },
});

export default SearchScreen;
