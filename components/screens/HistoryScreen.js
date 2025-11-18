import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useData } from "./DataContext";

export default function HistoryScreen() {
  const { theme } = useTheme();

  const { dataSets } = useData();
  const list = dataSets.list || [];

  const [typeFilter, setTypeFilter] = useState("wszystko");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sorting, setSorting] = useState("desc");


  const filtered = list
    .filter((item) => {
      if (typeFilter !== "Wszystko" && item.type !== typeFilter) return false;
      if (dateFrom && item.date < dateFrom) return false;
      if (dateTo && item.date > dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      if (sorting === "desc") return b.date.localeCompare(a.date);
      return a.date.localeCompare(b.date);
    });
    React.useEffect(() => {
      setTypeFilter("Wszystko"); 
    }, []);
  return (
    <ScrollView
      style={theme.containerStyle}
      contentContainerStyle={theme.centered}
    >
      <Text style={theme.titleStyle}>Historia operacji</Text>
      <View style={theme.centeredRow}>
        {["Wszystko", "Wydatki", "Dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[theme.button, typeFilter === t && theme.pressedButton]}
            onPress={() => setTypeFilter(t)}
          >
            <Text style={theme.buttonText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
        <View style={[theme.centeredRow, theme.width90]}>
          <View style={[theme.centeredRow, theme.width45]}>
            <Text style={theme.basicTextStyle}>Od:</Text>
            <TextInput
              style={theme.input}
              placeholder="YYYY-MM-DD"
              value={dateFrom}
              onChangeText={setDateFrom}
              placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
            />
          </View>
          <View style={[theme.centeredRow, theme.width45]}>
            <Text style={theme.basicTextStyle}>Do:</Text>
            <TextInput
              style={theme.input}
              placeholder="YYYY-MM-DD"
              value={dateTo}
              onChangeText={setDateTo}
              placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
            />
          </View>
        </View>
      <View style={theme.centeredRow}>
        <TouchableOpacity
          style={[theme.button, sorting === "desc" && theme.pressedButton]}
          onPress={() => setSorting("desc")}
        >
          <Text style={theme.buttonText}>Najnowsze</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.button, sorting !== "desc" && theme.pressedButton]}
          onPress={() => setSorting("asc")}
        >
          <Text style={theme.buttonText}>Najstarsze</Text>
        </TouchableOpacity>
      </View>
      {filtered.length === 0 && (
        <Text style={theme.basicTextStyle}>Brak wyników</Text>
      )}
      {filtered.map((item, index) => (
        <View key={item.id ?? index} style={[theme.entryRow, theme.width90]}>
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
