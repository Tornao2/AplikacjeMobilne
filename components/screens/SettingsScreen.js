import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Switch,
  Alert 
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/SettingsStyles";

export default function SettingsScreen() {
  const { theme, setDarkMode } = useTheme();
  const styles = createStyles(theme);
  const { 
      centeredContainerStyle, 
      titleStyle, 
      basicTextStyle, 
      input, 
      button, 
      buttonText, 
      spacedOutRow, 
      width90 
  } = theme;
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
    if (!editName || !editEmail || !editPassword) {
        Alert.alert("Błąd", "Wszystkie pola muszą być wypełnione.");
        return;
    }
    setUser({
      ...user,
      name: editName,
      email: editEmail,
      password: editPassword,
    });
    Alert.alert("Sukces", "Zapisano pomyślnie zmiany w profilu.");
  };
  return (
    <View style={centeredContainerStyle}>
      <Text style={titleStyle}>Ustawienia</Text>
      <Image source={user.avatar} style={styles.avatar} />
      <View style={[spacedOutRow, width90, { marginVertical: 2 }]}>
        <Text style={[basicTextStyle, { fontSize: 20 }]}>Motyw</Text>
        <Switch
          value={theme.darkMode}
          onValueChange={setDarkMode} 
          thumbColor={theme.colors.text}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        />
      </View>
      <TextInput
        style={[input, width90]}
        value={editName}
        onChangeText={setEditName}
        placeholder="Nazwa użytkownika"
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={[input, width90]}
        value={editEmail}
        onChangeText={setEditEmail}
        placeholder="E-mail"
        keyboardType="email-address" 
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={[input, width90]}
        value={editPassword}
        onChangeText={setEditPassword}
        placeholder="Hasło"
        secureTextEntry
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TouchableOpacity style={[button, width90, { marginTop: 5 }]} onPress={saveChanges}>
        <Text style={buttonText}>Zapisz zmiany</Text>
      </TouchableOpacity>
    </View>
  );
}