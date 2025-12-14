
import { useAuth } from "../AuthContext";
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
    email: "Email",
    password: "Password",
    avatar: require("../../assets/avatar.jpg"),
  });
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPassword, setEditPassword] = useState(user.password);
  const saveChanges = () => {
    if (!editEmail || !editPassword) {
        Alert.alert("Błąd", "Wszystkie pola muszą być wypełnione.");
        return;
    }
    setUser({
      ...user,
      email: editEmail,
      password: editPassword,
    });
    Alert.alert("Sukces", "Zapisano pomyślnie zmiany w profilu.");
  };

  const { logout } = useAuth();

  const handleLogout = () => {
     logout();
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
     <TouchableOpacity style={[button, width90, { marginTop: 10 }]} onPress={handleLogout}>
       <Text style={buttonText}>Wyloguj</Text>
     </TouchableOpacity>


    </View>
  );
}