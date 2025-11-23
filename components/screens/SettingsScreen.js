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
    <View style={theme.centeredContainerStyle}>
      <Text style={theme.titleStyle}>Ustawienia</Text>
      <Image source={user.avatar} style={styles.avatar} />
      <View style={[theme.spacedOutRow, theme.width90]}>
        <Text style={[theme.basicTextStyle, {fontSize: 20}]}>Motyw</Text>
        <Switch
          value={theme.darkMode}
          onValueChange={(value) => setDarkMode(value)}
          thumbColor={theme.colors.text}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        />
      </View>
      <TextInput
        style={[theme.input, theme.width90]}
        value={editName}
        onChangeText={setEditName}
        placeholder="Nazwa użytkownika"
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={[theme.input, theme.width90]}
        value={editEmail}
        onChangeText={setEditEmail}
        placeholder="E-mail"
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={[theme.input, theme.width90]}
        value={editPassword}
        onChangeText={setEditPassword}
        placeholder="Hasło"
        secureTextEntry
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TouchableOpacity style={[theme.button, theme.width90]} onPress={saveChanges}>
        <Text style={theme.buttonText}>Zapisz zmiany</Text>
      </TouchableOpacity>
    </View>
  );
}
