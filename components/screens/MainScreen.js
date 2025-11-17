import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/MainStyles";

import { useData } from "./DataContext";

export default function MainScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [period, setPeriod] = useState("miesiąc");

  const {dataSets} = useData();

  //const currentData = dataSets[period];
  //const total = currentData.reduce((sum, item) => sum + item.amount, 0);
  const screenWidth = Dimensions.get("window").width;

  const now = new Date();

  function filterByPeriod(list) {
    return (list || []).filter(item => {
      const d = new Date(item.date);

      if (period === "dzień") {
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (period === "miesiąc") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (period === "rok") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }
  const filteredData = filterByPeriod(dataSets.list || []);
  const total = filteredData.reduce((sum, item) => sum + item.amount, 0);

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
        data={filteredData.map((item) => ({
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
        {filteredData.map((item, index) => {
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
