import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Svg, { Rect } from "react-native-svg";

const ChartRating = ({ totalRating, rating }) => {
  const ratings = [0.5, 0.3, 0.1, 0.2, 0.4, 0.6, 0.9, 0.8, 0.7, 0.5];
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={190} height={80}>
          {ratings &&
            ratings.map((value, index) => (
              <React.Fragment key={index}>
                {/* Background Bar */}
                <Rect
                  x={index * 20}
                  y={0}
                  width={10}
                  height={80}
                  fill="#1F3646"
                  rx={5}
                />
                {/* Filled Rating */}
                <Rect
                  x={index * 20}
                  y={(1 - value) * 80}
                  width={10}
                  height={value * 80}
                  fill="#E9A825"
                  rx={5}
                />
              </React.Fragment>
            ))}
        </Svg>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.userRatingText}>{totalRating} Votes</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Text style={styles.ratingValue}>{rating}</Text>
          <Image
            source={require("../assets/images/cib_imdb.png")}
            style={{ width: 30, height: 30, borderRadius: 5 }}
          />
        </View>
      </View>
    </View>
  );
};

export default ChartRating;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 14,
    color: "#D1D1D1",
    marginBottom: 5,
  },
  chartContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  ratingContainer: {
    marginLeft: 20,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  userRatingText: {
    fontSize: 14,
    color: "#D1D1D1",
    marginRight: 5,
  },
  ratingValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E9A825",
  },
});
