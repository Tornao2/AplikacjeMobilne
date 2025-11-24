import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useData } from "./DataContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { dataSets } = useData();

  const [typeFilter, setTypeFilter] = useState("Wszystko");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sorting, setSorting] = useState("desc");
  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);
  const filtered = React.useMemo(() => {
    const from = dateFrom ? dateFrom.toISOString().split("T")[0] : null;
    const to = dateTo ? dateTo.toISOString().split("T")[0] : null;
    const list = dataSets.list || [];
    return list
      .filter((item) => {
        if (typeFilter !== "Wszystko" && item.type !== typeFilter) return false;
        if (from && item.date < from) return false;
        if (to && item.date > to) return false;
        return true;
      })
      .sort((a, b) => {
        if (sorting === "desc") return b.date.localeCompare(a.date);
        return a.date.localeCompare(b.date);
      });
  }, [dateFrom, dateTo, dataSets.list, typeFilter, sorting]);
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
            style={[theme.button, typeFilter === t && theme.pressedButton, {flex:1}]}
            onPress={() => setTypeFilter(t)}
          >
            <Text style={theme.buttonText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
       <View style={[theme.centeredRow, theme.width90]}>
      <View style={[theme.centeredRow, theme.width45, { flex: 1 }]}>
        <Text style={[theme.basicTextStyle, { fontSize: 20, marginBottom: 14 }]}>Od:</Text>
        <TouchableOpacity
          style={theme.input}
          onPress={() => setFromPickerVisible(true)}
        >
          <Text style={{ color: dateFrom ? theme.colors.text : theme.darkMode ? "#777" : "#aaa" }}>
            {dateFrom ? dateFrom.toISOString().split("T")[0] : "YYYY-MM-DD"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isFromPickerVisible}
          mode="date"
          maximumDate={dateTo || undefined}
          onConfirm={(date) => {
            setDateFrom(date);
            setFromPickerVisible(false);
          }}
          onCancel={() => {setDateFrom(null);setFromPickerVisible(false)}}
        />
      </View>
      <View style={[theme.centeredRow, theme.width45]}>
        <Text style={[theme.basicTextStyle, { fontSize: 20, marginBottom: 14 }]}>Do:</Text>
        <TouchableOpacity
          style={theme.input}
          onPress={() => setToPickerVisible(true)}
        >
          <Text style={{ color: dateTo ? theme.colors.text : theme.darkMode ? "#777" : "#aaa" }}>
            {dateTo ? dateTo.toISOString().split("T")[0] : "YYYY-MM-DD"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isToPickerVisible}
          mode="date"
          minimumDate={dateFrom || undefined}
          onConfirm={(date) => {
            setDateTo(date);
            setToPickerVisible(false);
          }}
          onCancel={() => {setDateTo(null);setToPickerVisible(false)}}
        />
      </View>
    </View>
      <View style={theme.centeredRow}>
        <TouchableOpacity
          style={[theme.button, sorting === "desc" && theme.pressedButton, {flex:1}]}
          onPress={() => setSorting("desc")}
        >
          <Text style={theme.buttonText}>Najnowsze</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.button, sorting !== "desc" && theme.pressedButton, {flex:1}]}
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
          <Text style={{color: item.type === "Dochody" ? "green" : "red", fontWeight: "700",}}>
            {item.amount} zł
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
