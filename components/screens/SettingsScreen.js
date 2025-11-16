import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Switch } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/SettingsStyles";

export default function SettingsScreen() {
  const { theme, setDarkMode } = useTheme();
  const styles = createStyles(theme);

  const [user, setUser] = useState({
    name: "admin",
    email: "admin@gmail.com",
    password: "1234",
    avatar: require("../../assets/avatar.jpg"),
  });

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
    alert("Zapisano zmiany");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ustawienia</Text>
      <Image source={user.avatar} style={styles.avatar} />

      <View style={styles.themeRow}>
        <Text style={styles.label}>Motyw</Text>
        <Switch
          value={theme.darkMode}
          onValueChange={(value) => setDarkMode(value)}
          thumbColor={theme.colors.text}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        />
      </View>

      <TextInput
        style={styles.input}
        value={editName}
        onChangeText={setEditName}
        placeholder="Nazwa użytkownika"
        placeholderTextColor={theme.colors.border}
      />
      <TextInput
        style={styles.input}
        value={editEmail}
        onChangeText={setEditEmail}
        placeholder="E-mail"
        placeholderTextColor={theme.colors.border}
      />
      <TextInput
        style={styles.input}
        value={editPassword}
        onChangeText={setEditPassword}
        placeholder="Hasło"
        secureTextEntry
        placeholderTextColor={theme.colors.border}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
      </TouchableOpacity>
    </View>
  );
}
