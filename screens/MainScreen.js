import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function MainScreen() {
  const navigation = useNavigation();
  const [period, setPeriod] = useState("miesiąc");

  // Dane do wykresu
  const dataSets = {
    dzień: [
      { name: "Jedzenie", amount: 80, color: "#FF6384" },
      { name: "Transport", amount: 20, color: "#36A2EB" },
    ],
    miesiąc: [
      { name: "Artykuły spożywcze", amount: 4000, color: "#FF6384" },
      { name: "Kredyty", amount: 1200, color: "#36A2EB" },
      { name: "Leasingi", amount: 800, color: "#9966FF" },
      { name: "Czynsz", amount: 1000, color: "#FFCE56" },
      { name: "Media", amount: 500, color: "#4BC0C0" },
      { name: "Rozrywka", amount: 300, color: "#FF9F40" },
    ],
    rok: [
      { name: "Podróże", amount: 8000, color: "#4BC0C0" },
      { name: "Oszczędności", amount: 10000, color: "#36A2EB" },
      { name: "Wynajem", amount: 5000, color: "#FF6384" },
    ],
  };

  const currentData = dataSets[period];
  const total = currentData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Przyciski okresu */}
      <View style={styles.periodButtons}>
        {["dzień", "miesiąc", "rok"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.activePeriod]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodText, period === p && styles.activePeriodText]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wykres */}
      <PieChart
        data={currentData.map((item) => ({
          name: item.name,
          population: item.amount,
          color: item.color,
          legendFontColor: "#333",
          legendFontSize: 14,
        }))}
        width={screenWidth - 40}
        height={250}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="90"
        chartConfig={{
          color: () => `#333`,
        }}
        hasLegend={false}
        center={[0, 0]}
        absolute
      />

      {/* Suma i przycisk edycji */}
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Łączna suma dochodów: {total} zł</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditFinance")}
        >
          <Text style={styles.editButtonText}>Edytuj</Text>
        </TouchableOpacity>
      </View>

      {/* Lista wydatków */}
      <View style={styles.listContainer}>
        {currentData.map((item, index) => {
          const percent = ((item.amount / total) * 100).toFixed(2);
          return (
            <View key={index} style={styles.listItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPercent}>{percent}%</Text>
              <Text style={styles.itemAmount}>{item.amount} zł</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: "#fff", paddingVertical: 40 },
  periodButtons: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  periodButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 5,
  },
  periodText: { color: "#007AFF", fontWeight: "600" },
  activePeriod: { backgroundColor: "#007AFF" },
  activePeriodText: { color: "#fff" },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },
  totalText: { fontSize: 18, fontWeight: "600" },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: { color: "#fff", fontWeight: "600" },
  listContainer: { width: "90%", marginTop: 20 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: { flex: 1, fontWeight: "600" },
  itemPercent: { width: 60, textAlign: "center" },
  itemAmount: { width: 90, textAlign: "right" },
});
