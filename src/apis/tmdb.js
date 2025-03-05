import axios from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "@env";

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
});

export const getTrendingMovies = async () => {
  try {
    const response = await api.get("/trending/movie/day");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await api.get("/movie/top_rated");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
};

export const getNowPlayingMovies = async () => {
  try {
    const response = await api.get("/movie/now_playing");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    throw error;
  }
};

export const getPopularMovies = async () => {
  try {
    const response = await api.get("/movie/popular");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const getTVSeriesTopRated = async () => {
  try {
    const response = await api.get("/tv/top_rated");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated tv series:", error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await api.get("/search/movie", {
      params: {
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId, mediaType = "movie") => {
  try {
    const response = await api.get(
      `/${mediaType}/${movieId}?append_to_response=credits`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getMovieVideos = async (movieId, mediaType = "movie") => {
  try {
    const response = await api.get(`/${mediaType}/${movieId}/videos`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

export const getMovieReviews = async (movieId, mediaType = "movie") => {
  try {
    const response = await api.get(`/${mediaType}/${movieId}/reviews`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const getMovieWatchProviders = async (movieId, mediaType = "movie") => {
  try {
    const response = await api.get(`/${mediaType}/${movieId}/watch/providers`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return null;
  }
};

export const getPopularActors = async () => {
  try {
    const response = await api.get("/person/popular");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular actors:", error);
    throw error;
  }
};

export const getActorDetails = async (actorId) => {
  try {
    const response = await api.get(`/person/${actorId}?append_to_response=external_ids,movie_credits,tv_credits,images`);
    return response.data;
  } catch (error) {
    console.error("Error fetching actor details:", error);
    throw error;
  }
};