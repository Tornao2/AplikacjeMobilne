import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/EditStyles";

export default function EditScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const [type, setType] = useState("wydatki");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    if (!name || !amount) return alert("Uzupełnij wszystkie pola!");
    setEntries([...entries, { id: Date.now(), name, amount: parseFloat(amount), type }]);
    setName("");
    setAmount("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edycja</Text>

      <View style={styles.switchRow}>
        {["wydatki", "dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.switchButton, type === t && styles.activeSwitch]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.switchText, type === t && styles.activeSwitchText]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder={`Nazwa ${type === "wydatki" ? "wydatku" : "dochodu"}`}
        placeholderTextColor={theme.input.placeholderColor}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kwota (zł)"
        placeholderTextColor={theme.input.placeholderColor}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={addEntry}>
        <Text style={styles.buttonText}>Dodaj {type}</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.name} - {item.amount} zł</Text>
            <Text style={[styles.itemType, { color: item.type === "dochody" ? theme.colors.primary : theme.colors.border }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
