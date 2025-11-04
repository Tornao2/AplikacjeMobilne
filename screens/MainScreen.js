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
      { name: "Artykuły spożywcze", amount: 500, color: "red" },
      { name: "Transport", amount: 20, color: "green" },
    ],

    miesiąc: [
      { name: "Artykuły spożywcze", amount: 500, color: "red" },
      { name: "Kredyty", amount: 1200, color: "orange" },
      { name: "Leasingi", amount: 800, color: "purple" },
      { name: "Transport", amount: 300, color: "blue" },
      { name: "Czynsz", amount: 1000, color: "pink" },
      { name: "Media", amount: 500, color: "yellow" },
      { name: "Rozrywka", amount: 300, color: "black" },
      { name: "Oszczędności", amount: 500, color: "green" },
      { name: "Wynajem", amount: 1000, color: "gray" },
    ],

    rok: [
      { name: "Artykuły spożywcze", amount: 500, color: "red" },
      { name: "Kredyty", amount: 1200, color: "orange" },
      { name: "Leasingi", amount: 10000, color: "purple" },
      { name: "Transport", amount: 3600, color: "blue" },
      { name: "Czynsz", amount: 12000, color: "pink" },
      { name: "Media", amount: 3000, color: "yellow" },
      { name: "Rozrywka", amount: 1800, color: "black" },
      { name: "Podróże", amount: 8000, color: "cyan" },
      { name: "Oszczędności", amount: 6000, color: "green" },
      { name: "Wynajem", amount: 12000, color: "gray" },
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
          legendFontColor: "dimgray",
          legendFontSize: 14,
        }))}
        width={screenWidth - 40}
        height={250}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="90"
        chartConfig={{
          color: () => `dimgray`,
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
          onPress={() => navigation.navigate("Edit")}
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
  container: { alignItems: "center", backgroundColor: "white", paddingVertical: 40 },
  periodButtons: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  periodButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 5,
  },
  periodText: { color: "black", fontWeight: "600" },
  activePeriod: { backgroundColor: "black" },
  activePeriodText: { color: "white" },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },
  totalText: { fontSize: 18, fontWeight: "600" },
  editButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: { color: "white", fontWeight: "600" },
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
