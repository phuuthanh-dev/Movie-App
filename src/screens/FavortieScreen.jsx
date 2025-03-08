import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { getPopularMovies } from "../apis/tmdb";
import MovieCard from "../components/MovieCard";
import SpaceComponent from "../components/SpaceComponent";
import { getFavoriteMovies } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";

const FavoriteScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      loadFavoriteMovies();
    } else {
      const delayDebounce = setTimeout(() => {
        if (query.trim() !== "") {
          handleSearch();
        }
      }, 1000)

      return () => clearTimeout(delayDebounce);
    }
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteMovies();
    }, [])
  );

  const loadFavoriteMovies = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteMovies();
      setMovies(data);
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
      const data = await getFavoriteMovies();
      const filteredMovies = data.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()));
      setMovies(filteredMovies);
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
          <Text style={styles.title}>Your Favorites</Text>
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
        </>
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;

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
    paddingTop: Platform.OS === 'android' ? 40 : 0
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
});
