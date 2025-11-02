import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";


export default function SettingsScreen() {
  // 🔹 Stan motywu (true = dark)
  //const [darkMode, setDarkMode] = useState(false);
   const { theme, toggleTheme, setDarkMode } = useTheme();
   const darkMode = theme.darkMode;
  // 🔹 Dane użytkownika (na sztywno)
  const [user, setUser] = useState({
    name: "admin",
    email: "admin@gmail.com",
    password: "1234",
    avatar: require("../assets/avatar.jpg"), // dodaj avatar.png do /assets/
  });

  // 🔹 Edytowane wartości
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPassword, setEditPassword] = useState(user.password);

  const saveChanges = () => {
    setUser({
      ...user,
      name: editName,
      email: editEmail,
      password: editPassword,
    });
    alert("Zapisano zmiany profilu ✅");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#1c1c1c" : "#fff" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: darkMode ? "#fff" : "#000" },
        ]}
      >
        Ustawienia profilu
      </Text>

      {/* Avatar */}
      <Image source={user.avatar} style={styles.avatar} />

      {/* Przełącznik motywu */}
      <View style={styles.themeRow}>
        <Text style={[styles.label, { color: darkMode ? "#fff" : "#000" }]}>
          Motyw ciemny
        </Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          //onValueChange={toggleTheme}

          thumbColor={darkMode ? "#fff" : "#007AFF"}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
        />
      </View>

      {/* Edycja profilu */}
      <TextInput
        style={[
          styles.input,
          { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" },
        ]}
        value={editName}
        onChangeText={setEditName}
        placeholder="Nazwa użytkownika"
        placeholderTextColor={darkMode ? "#888" : "#666"}
      />

      <TextInput
        style={[
          styles.input,
          { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" },
        ]}
        value={editEmail}
        onChangeText={setEditEmail}
        placeholder="E-mail"
        placeholderTextColor={darkMode ? "#888" : "#666"}
      />

      <TextInput
        style={[
          styles.input,
          { color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#555" : "#ccc" },
        ]}
        value={editPassword}
        onChangeText={setEditPassword}
        placeholder="Hasło"
        secureTextEntry
        placeholderTextColor={darkMode ? "#888" : "#666"}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: darkMode ? "#555" : "#007AFF" }]}
        onPress={saveChanges}
      >
        <Text style={styles.saveButtonText}>💾 Zapisz zmiany</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 25,
  },
  label: { fontSize: 16, fontWeight: "600" },
  input: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});
