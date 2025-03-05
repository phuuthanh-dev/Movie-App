import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import HTML from "react-native-render-html";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TMDB_IMAGE_BASE_URL } from '@env';

const ReviewSection = ({ reviews }) => {
  const { width: contentWidth } = useWindowDimensions();
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Reviews</Text>
      <View style={styles.reviewsContainer}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAuthor}>
                <Image
                  style={styles.authorAvatar}
                  source={{
                    uri: review.author_details?.avatar_path
                      ? review.author_details.avatar_path.startsWith("/http")
                        ? review.author_details.avatar_path.substring(1)
                        : `${TMDB_IMAGE_BASE_URL}${review.author_details.avatar_path}`
                      : "https://www.gravatar.com/avatar/default?d=mp",
                  }}
                />
                <Text style={styles.authorName}>{review.author}</Text>
              </View>
              <View style={styles.reviewRating}>
                <TouchableOpacity style={styles.ratingButton}>
                  <Icon name="thumbs-up" size={16} color="#888" />
                  <Text style={styles.ratingCount}>
                    {review.author_details.rating || 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ratingButton}>
                  <Icon name="thumbs-down" size={16} color="#888" />
                  <Text style={styles.ratingCount}>0</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                maxHeight: expandedReviews[review.id] ? undefined : 100,
              }}
            >
              <HTML
                source={{ html: review.content }}
                contentWidth={contentWidth - 72}
                baseStyle={styles.reviewContent}
                tagsStyles={{
                  a: { color: "#84BAF1", textDecorationLine: "underline" },
                  p: { color: "#fff", fontFamily: "Poppins-Regular" },
                }}
                renderersProps={{
                  a: {
                    onPress: (_, href) => {
                      Linking.openURL(href);
                    },
                  },
                }}
              />
            </View>
            {review.content.length > 100 && (
              <TouchableOpacity
                onPress={() => toggleReviewExpansion(review.id)}
              >
                <Text style={styles.readMoreText}>
                  {expandedReviews[review.id] ? "Show Less" : "Read More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </>
  );
};

export default ReviewSection;

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
  },
  // Reviews Section
  reviewsContainer: {
    marginBottom: 24,
  },
  reviewItem: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewAuthor: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  ratingCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#888",
    marginLeft: 4,
  },
  reviewContent: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  reviewBackButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    padding: 8,
  },
  readMoreText: {
    color: "#84BAF1",
    marginTop: 5,
    fontSize: 14,
  },
});
