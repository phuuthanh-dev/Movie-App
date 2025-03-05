import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@favorites";

export const getFavoriteMovies = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const toggleFavorite = async (movie) => {
  try {
    const favorites = await getFavoriteMovies();
    const isFavorite = favorites.some((fav) => fav.id === movie.id);

    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      newFavorites = [...favorites, movie];
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};
