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
import {
  getPopularActors,
  getPopularMovies,
  getPopularTV,
  getTrendingPeople,
  searchMovies,
  searchActors,
  searchTV,
  searchPeople,
} from "../apis/tmdb";
import SpaceComponent from "../components/SpaceComponent";
import ActorCard from "../components/ActorCard";

const SearchScreen = ({ navigation }) => {
  const tabs = [
    { key: "movie", label: "Movies", fetch: getPopularMovies, search: searchMovies },
    { key: "tv", label: "TV Shows", fetch: getPopularTV, search: searchTV },
    { key: "actor", label: "Actors", fetch: getPopularActors, search: searchActors },
    { key: "people", label: "People", fetch: getTrendingPeople, search: searchPeople },
  ];
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedTab, setSelectedTab] = useState("movie");

  // Debounce Effect
  useEffect(() => {
    if (query.trim() === "") {
      handleGetData();
    } else {
      const delayDebounce = setTimeout(() => {
        if (query.trim() !== "") {
          handleSearch();
        }
      }, 1000);

      return () => clearTimeout(delayDebounce);
    }
  }, [query, selectedTab]);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    setLoading(true);
    try {
      const tab = tabs.find((t) => t.key === selectedTab);
      if (tab) {
        const result = await tab.fetch();
        setData(result.filter((item) => item.poster_path || item.profile_path));
        setTitle(`Popular ${tab.label}`);
      }
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
      const tab = tabs.find((t) => t.key === selectedTab);
      if (tab) {
        const result = await tab.search(query);
        setData(result.filter((item) => item.poster_path || item.profile_path));
        setTitle(`${tab.label} Search Results`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "movie":
        return (
          <FlatList
            key="movie-grid"
            data={data}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                width={120}
                isShowInfo={false}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", { movie: item })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<SpaceComponent height={70} />}
          />
        );
      case "actor":
        return (
          <FlatList
            key="actor-grid"
            data={data}
            renderItem={({ item }) => (
              <ActorCard
                actor={item}
                onPress={() =>
                  navigation.navigate("ActorDetailScreen", { actor: item })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<SpaceComponent height={70} />}
          />
        );
      case "tv":
        return (
          <FlatList
            key="tv-grid"
            data={data}
            renderItem={({ item }) => (
              <MovieCard
                movie={{ ...item, title: item.name }}
                width={120}
                isShowInfo={false}
                onPress={() =>
                  navigation.navigate("MovieDetailScreen", {
                    movie: item,
                    mediaType: "tv",
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<SpaceComponent height={70} />}
          />
        );
      case "people":
        return (
          <FlatList
            key="people-grid"
            data={data}
            renderItem={({ item }) => (
              <ActorCard
                actor={item}
                onPress={() =>
                  navigation.navigate("ActorDetailScreen", { actor: item })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<SpaceComponent height={70} />}
          />
        );
      default:
        return null;
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
          {renderContent()}
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
    paddingHorizontal: 16,
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
  companyItem: {
    backgroundColor: "#003355",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  companyName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  companyCountry: {
    color: "#ffca45",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
});

export default SearchScreen;
