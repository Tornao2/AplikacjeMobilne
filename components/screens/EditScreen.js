import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/EditStyles";

import { useData } from "./DataContext";

export default function EditScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const { addToList } = useData();

  const [type, setType] = useState("wydatki");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    if (!name || !amount) return alert("Uzupełnij wszystkie pola!");
    addToList({
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
      type,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    });
    setName("");
    setAmount("");

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edycja</Text>

      <View style={styles.switchRow}>
        {["wydatki", "dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[theme.input, type === t && styles.activeSwitch]}
            onPress={() => setType(t)}
          >
            <Text style={theme.basicTextStyle}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={theme.input}
        placeholder={`Nazwa ${type === "wydatki" ? "wydatku" : "dochodu"}`}
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={theme.input}
        placeholder="Kwota (zł)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />

      <TouchableOpacity style={theme.button} onPress={addEntry}>
        <Text style={theme.buttonText}>Dodaj {type}</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={theme.basicTextStyle}>{item.name} - {item.amount} zł</Text>
            <Text style={{ color: item.type === "dochody" ? theme.colors.primary : theme.colors.border }}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={theme.button} onPress={() => navigation.goBack()}>
          <Text style={theme.buttonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
