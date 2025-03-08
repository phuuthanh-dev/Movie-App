import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { getTVSeasonDetails } from "../../../apis/tmdb";
import { TMDB_IMAGE_BASE_URL } from "@env";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SpaceComponent from "../../../components/SpaceComponent";
import EpisodeCard from "../../../components/EpisodeCard";

const EpisodesSection = ({ tvId, numberOfSeasons }) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadSeasonData();
  }, [selectedSeason]);

  const loadSeasonData = async () => {
    try {
      const data = await getTVSeasonDetails(tvId, selectedSeason);
      setSeasonData(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.seasonHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.sectionTitle}>Episodes</Text>
        <View style={styles.seasonSelector}>
          <Text style={styles.seasonText}>Season {selectedSeason}</Text>
          <MaterialIcons
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <>
          <View style={styles.seasonList}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Array.from({ length: numberOfSeasons }, (_, i) => i + 1)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.seasonButton,
                    selectedSeason === item && styles.selectedSeason,
                  ]}
                  onPress={() => setSelectedSeason(item)}
                >
                  <Text
                    style={[
                      styles.seasonButtonText,
                      selectedSeason === item && styles.selectedSeasonText,
                    ]}
                  >
                    Season {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </View>

          <SpaceComponent height={16} />

          {seasonData && (
            <>
              {seasonData.episodes.some(
                (ep) => new Date(ep.air_date) > new Date()
              ) ? (
                // If it's a future season, only show the first episode
                <View
                  style={[styles.futureSeasonMessage, styles.notAiredContainer]}
                >
                  <Text style={styles.futureSeasonText}>
                    More episodes will be available soon
                  </Text>
                  <View style={styles.metaContainer}>
                    <Text style={[styles.episodeMeta, styles.notAiredText]}>
                      Coming{" "}
                      {new Date(
                        seasonData.episodes[0].air_date
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ) : (
                // If it's a current/past season, show all episodes
                <FlatList
                  data={seasonData.episodes}
                  renderItem={({ item }) => <EpisodeCard item={item} />}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
  },
  seasonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seasonSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  seasonText: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    marginRight: 4,
  },
  seasonList: {
    marginBottom: 16,
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 8,
  },
  selectedSeason: {
    backgroundColor: "#E50914",
  },
  seasonButtonText: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },
  selectedSeasonText: {
    color: "#fff",
  },
  notAiredContainer: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#E50914",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  episodeMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
  },
  notAiredText: {
    color: "#E50914",
  },
  futureSeasonMessage: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    marginBottom: 16,
  },
  futureSeasonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default EpisodesSection;
