import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/HistoryStyles";
import { useData } from "./DataContext";

export default function HistoryScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { dataSets } = useData();
  const list = dataSets.list || [];

  const [typeFilter, setTypeFilter] = useState("wszystko");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sorting, setSorting] = useState("desc");


  const filtered = list
    .filter((item) => {
      if (typeFilter !== "wszystko" && item.type !== typeFilter) return false;
      if (dateFrom && item.date < dateFrom) return false;
      if (dateTo && item.date > dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      if (sorting === "desc") return b.date.localeCompare(a.date);
      return a.date.localeCompare(b.date);
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 30,
        alignItems: "center",
      }}
    >
      <Text style={theme.titleStyle}>Historia operacji</Text>

      <View style={styles.filterRow}>
        {["Wszystko", "Wydatki", "Dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterButton, typeFilter === t && styles.activeFilter]}
            onPress={() => setTypeFilter(t)}
          >
            <Text
              style={[
                theme.basicTextStyle,
                typeFilter === t && { color: theme.colors.background }
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        <View style={styles.dateRow}>
          <View style={styles.dateInputWrapper}>
            <Text style={theme.basicTextStyle}>Od:</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={dateFrom}
              onChangeText={setDateFrom}
              placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
            />
          </View>

          <View style={styles.dateInputWrapper}>
            <Text style={theme.basicTextStyle}>Do:</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={dateTo}
              onChangeText={setDateTo}
              placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
            />
          </View>
        </View>


      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, sorting === "desc" && styles.activeFilter]}
          onPress={() => setSorting("desc")}
        >
          <Text
            style={[
              theme.basicTextStyle,
              sorting === "desc" && { color: theme.colors.background }
            ]}
          >
            Najnowsze
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, sorting === "asc" && styles.activeFilter]}
          onPress={() => setSorting("asc")}
        >
          <Text
            style={[
              theme.basicTextStyle,
              sorting === "asc" && { color: theme.colors.background }
            ]}
          >
            Najstarsze
          </Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 && (
        <Text style={theme.basicTextStyle}>Brak wyników</Text>
      )}

      {filtered.map((item, index) => (
        <View key={item.id ?? index} style={styles.entryRow}>
          <View style={{ flex: 1 }}>
            <Text style={theme.basicTextStyle}>{item.name}</Text>
            <Text style={[theme.basicTextStyle, { fontSize: 12, opacity: 0.7 }]}>
              {item.date}
            </Text>
          </View>

          <Text
            style={{
              color: item.type === "dochody" ? "lime" : "red",
              fontWeight: "700",
            }}
          >
            {item.amount} zł
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
