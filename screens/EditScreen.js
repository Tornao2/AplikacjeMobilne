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
      <Text style={styles.title}>Edycja</Text>

      {/* Przełącznik typu */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchButton, type === "wydatki" && styles.active]}
          onPress={() => setType("wydatki")}
        >
          <Text style={[styles.switchText, type === "wydatki" && styles.activeText]}>
            Wydatki
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, type === "dochody" && styles.active]}
          onPress={() => setType("dochody")}
        >
          <Text style={[styles.switchText, type === "dochody" && styles.activeText]}>
            Dochody
          </Text>
        </TouchableOpacity>
      </View>

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
        <Text style={styles.addButtonText}>Dodaj {type}</Text>
      </TouchableOpacity>

      {/* Lista wpisów */}
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

      {/* Przycisk powrotu na dole */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  switchRow: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  switchButton: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  switchText: { color: "black", fontWeight: "600" },
  active: { backgroundColor: "black" },
  activeText: { color: "white" },
  input: {
    borderWidth: 1,
    borderColor: "darkgrey",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "white", fontWeight: "700" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "dimgray",
    paddingVertical: 8,
  },
  itemText: { fontSize: 16 },
  itemType: { fontWeight: "600" },

  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 15,
  },
  backButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",

  },
  backText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
