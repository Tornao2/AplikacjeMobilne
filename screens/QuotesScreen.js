import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QuotesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>
        "Nie oszczędzaj tego, co zostaje po wszystkich wydatkach, lecz wydawaj,
        co zostaje po odłożeniu oszczędności."
      </Text>
      <Text style={styles.author}>– Warren E. Buffett</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  quote: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
    lineHeight: 28,
  },
  author: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
});
