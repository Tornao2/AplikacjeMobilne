import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EditScreen() {
  const [type, setType] = useState("wydatki"); // "wydatki" lub "dochody"
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);
  const navigation = useNavigation();
  const addEntry = () => {
    if (!name || !amount) return alert("Uzupełnij wszystkie pola!");
    const newEntry = { id: Date.now(), name, amount: parseFloat(amount), type };
    setEntries([...entries, newEntry]);
    setName("");
    setAmount("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>⬅ Powrót</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edycja finansów</Text>

      {/* Przełącznik typu */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchButton, type === "wydatki" && styles.active]}
          onPress={() => setType("wydatki")}
        >
          <Text style={[styles.switchText, type === "wydatki" && styles.activeText]}>
            💸 Wydatki
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, type === "dochody" && styles.active]}
          onPress={() => setType("dochody")}
        >
          <Text style={[styles.switchText, type === "dochody" && styles.activeText]}>
            💰 Dochody
          </Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity
          style={[styles.switchButton, type === "dochody" && styles.active]}
          onPress={() => setType("dochody")}
        >
          <Text style={[styles.switchText, type === "dochody" && styles.activeText]}>
            💰 Dochody
          </Text>
        </TouchableOpacity>


      {/* Formularz dodania */}
      <TextInput
        style={styles.input}
        placeholder={`Nazwa ${type === "wydatki" ? "wydatku" : "dochodu"}`}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kwota (zł)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.addButton} onPress={addEntry}>
        <Text style={styles.addButtonText}>➕ Dodaj {type}</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.name} - {item.amount} zł
            </Text>
            <Text style={[styles.itemType, { color: item.type === "dochody" ? "green" : "red" }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  switchRow: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  switchButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  switchText: { color: "#007AFF", fontWeight: "600" },
  active: { backgroundColor: "#007AFF" },
  activeText: { color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "700" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
    backButton: {
      alignSelf: "flex-start",
      marginBottom: 10,
      paddingHorizontal: 10,
    },
backText: { color: "#007AFF", fontWeight: "600", fontSize: 16 },


  itemText: { fontSize: 16 },
  itemType: { fontWeight: "600" },
});
