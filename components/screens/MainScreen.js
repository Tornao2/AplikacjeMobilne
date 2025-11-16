import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/MainStyles";

export default function MainScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [period, setPeriod] = useState("miesiąc");

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
  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.periodButtons}>
        {["dzień", "miesiąc", "rok"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[theme.input, period === p && styles.activePeriod]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[theme.basicTextStyle, period === p && styles.activePeriodText]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <PieChart
        data={currentData.map((item) => ({
          name: item.name,
          population: item.amount,
          color: item.color,
          legendFontColor: theme.colors.text,
          legendFontSize: 14,
        }))}
        style = {styles.pieChart}
        width={screenWidth}
        height={250}
        accessor="population"
        backgroundColor="transparent"
        chartConfig={{ color: () => theme.colors.text }}
        hasLegend={false}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Łączna suma dochodów: {total} zł</Text>
        <TouchableOpacity
          style={theme.button}
          onPress={() => navigation.navigate("Edit")}
        >
          <Text style={theme.buttonText}>Edytuj</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {currentData.map((item, index) => {
          const percent = ((item.amount / total) * 100).toFixed(2);
          return (
            <View key={index} style={styles.listItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={theme.basicTextStyle}>{percent}%</Text>
              <Text style={styles.itemAmount}>{item.amount} zł</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
