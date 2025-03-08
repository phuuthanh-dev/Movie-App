import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@favorites";
const PLAYLIST_KEY = "@playlist";

export const getFavoriteMovies = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const getPlaylist = async () => {
  try {
    const playlist = await AsyncStorage.getItem(PLAYLIST_KEY);
    return playlist ? JSON.parse(playlist) : [];
  } catch (error) {
    console.error("Error getting playlist:", error);
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
      newFavorites = [movie, ...favorites];
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const toggleToPlaylist = async (movie) => {
  try {
    const playlist = await getPlaylist();
    const isAdded = playlist.some((fav) => fav.id === movie.id);
    let newPlaylist;
    
    if (isAdded) {
      newPlaylist = playlist.filter((fav) => fav.id !== movie.id);
    } else {
      newPlaylist = [movie, ...playlist];
    }

    await AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify(newPlaylist));
    return newPlaylist;
  } catch (error) {
    console.error("Error adding to playlist:", error);
    throw error;
  }
};

