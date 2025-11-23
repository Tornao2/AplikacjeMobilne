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
  const [type, setType] = useState("Dochody");
  const {dataSets} = useData();

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
  const filteredData = filterByPeriod(dataSets.list || []).filter(item => item.type === type);
  const total = filteredData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScrollView
      contentContainerStyle={theme.centeredContainerStyle}
    >
      <View style={theme.spacedOutRow}>
        {["Wydatki", "Dochody"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[theme.button, type === p && theme.pressedButton, {flex:1}]}
            onPress={() => setType(p)}
          >
            <Text style={[theme.buttonText, type === p && styles.activePeriodText]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={theme.spacedOutRow}>
        {["dzień", "miesiąc", "rok"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[theme.button, period === p && theme.pressedButton, {flex:1}]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[theme.buttonText, period === p && styles.activePeriodText]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredData.length > 0 ? (
          <View><PieChart
          data={filteredData.map((item) => ({
            name: item.name,
            population: item.amount,
            color: item.color,
            legendFontColor: theme.colors.text,
            legendFontSize: 14,
          }))}
          width={screenWidth}
          height={250}
          accessor="population"
          backgroundColor="transparent"
          chartConfig={{ color: () => theme.colors.text }}
          hasLegend={false}
          center={[screenWidth/4, 0]}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
        {filteredData.map((item, idx) => (
          <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 4 }}>
            <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 4 }} />
            <Text style={{ color: theme.colors.text, fontSize: 12 }}>{item.name}</Text>
          </View>
        ))}
      </View></View>
      ) : (
        <View
          style={{
            width: 250,
            height: 250,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={[{ color: theme.colors.text, fontSize: 32,}]}>Brak danych</Text>
        </View>
      )}
      <Text style={theme.biggerTextStyle}>Łączna suma {type === "Dochody" ? "dochodów" : "wydatków"}: {total} zł</Text>
      <ScrollView style={[theme.width90, {marginBottom: 10, maxHeight: "50%"}]}>
        {filteredData.map((item, index) => {
          const percent = ((item.amount / total) * 100).toFixed(2);
          return (
            <View key={index} style={theme.entryRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={theme.basicTextStyle}>{percent}%</Text>
              <Text style={styles.itemAmount}>{item.amount} zł</Text>
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
          style={[theme.button, theme.footer, theme.width90]}
          onPress={() => navigation.navigate("Edit")}
        >
          <Text style={[theme.buttonText]}>Dodaj</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}
