//import { useAuth } from "../AuthContext";
//import { useState } from "react";
//import {
//  View,
//  Text,
//  TextInput,
//  TouchableOpacity,
//  Image,
//  Switch,
//  Alert,
//  Platform
//} from "react-native";
//import * as ImagePicker from "expo-image-picker";
//import { useTheme } from "../theme/ThemeContext";
//import { createStyles } from "../theme/SettingsStyles";
//
//export default function SettingsScreen() {
//  const { theme, setDarkMode } = useTheme();
//  const styles = createStyles(theme);
//  const {
//      centeredContainerStyle,
//      titleStyle,
//      basicTextStyle,
//      input,
//      button,
//      buttonText,
//      spacedOutRow,
//      width90
//  } = theme;
//  const [user, setUser] = useState({
//    email: "Email",
//    password: "Password",
//    //avatar: require("../../assets/avatar.jpg"),
//    avatarUri: null,
//  });
//  const [editEmail, setEditEmail] = useState(user.email);
//  const [editPassword, setEditPassword] = useState(user.password);
//  const saveChanges = () => {
//    if (!editEmail || !editPassword) {
//        Alert.alert("Błąd", "Wszystkie pola muszą być wypełnione.");
//        return;
//    }
//    setUser({
//      ...user,
//      email: editEmail,
//      password: editPassword,
//    });
//    Alert.alert("Sukces", "Zapisano pomyślnie zmiany w profilu.");
//  };
//
//  const { logout } = useAuth();
//
//  const handleLogout = () => {
//     logout();
//  };
//
//
//  return (
//    <View style={centeredContainerStyle}>
//      <Text style={titleStyle}>Ustawienia</Text>
//      //<Image source={user.avatar} style={styles.avatar} />
//        <Image source={ user.avatarUri ? { uri: user.avatarUri } : require("../../assets/avatar.jpg")}style={styles.avatar}/>
//      <View style={[spacedOutRow, width90, { marginVertical: 2 }]}>
//        <Text style={[basicTextStyle, { fontSize: 20 }]}>Motyw</Text>
//        <Switch
//          value={theme.darkMode}
//          onValueChange={setDarkMode}
//          thumbColor={theme.colors.text}
//          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
//        />
//      </View>
//      <TextInput
//        style={[input, width90]}
//        value={editEmail}
//        onChangeText={setEditEmail}
//        placeholder="E-mail"
//        keyboardType="email-address"
//        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
//      />
//      <TextInput
//        style={[input, width90]}
//        value={editPassword}
//        onChangeText={setEditPassword}
//        placeholder="Hasło"
//        secureTextEntry
//        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
//      />
//      <TouchableOpacity style={[button, width90, { marginTop: 5 }]} onPress={saveChanges}>
//        <Text style={buttonText}>Zapisz zmiany</Text>
//      </TouchableOpacity>
//     <TouchableOpacity style={[button, width90, { marginTop: 10 }]} onPress={handleLogout}>
//       <Text style={buttonText}>Wyloguj</Text>
//     </TouchableOpacity>
//
//
//    </View>
//  );
//}
//



import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/SettingsStyles";
import { useAuth } from "../AuthContext";
import { API } from "../api";

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
    width90,
  } = theme;

  const { user, token, logout } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [editEmail, setEditEmail] = useState(user?.email ?? "");

  // avatar lokalnie
  const [avatarUri, setAvatarUri] = useState(null);

  // kropki = długość aktualnego hasła (haslo) z DB
  const [passwordLength, setPasswordLength] = useState(8);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editPassword, setEditPassword] = useState("");

  const MASK = useMemo(
    () => "•".repeat(Math.max(1, passwordLength || 8)),
    [passwordLength]
  );

  useEffect(() => {
    setEditEmail(user?.email ?? "");
  }, [user?.email]);

  const handleUnauthorized = () => {
    Alert.alert("Błąd", "Sesja wygasła. Zaloguj się ponownie.");
    logout();
  };

  const getAccountByEmail = async (email) => {
    const res = await fetch(
      `${API.ACCOUNTS}?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 401) {
      handleUnauthorized();
      return null;
    }
    if (!res.ok) throw new Error(`Account lookup error: ${res.status}`);

    const list = await res.json();
    return list?.[0] ?? null;
  };

  const refreshPasswordLength = async (email) => {
    try {
      if (!email || !token) return;
      const acc = await getAccountByEmail(email);
      if (!acc) return;

      const len = typeof acc.haslo === "string" ? acc.haslo.length : 8;
      setPasswordLength(len > 0 ? len : 8);
    } catch (e) {
      console.error("refreshPasswordLength error:", e);
    }
  };

  useEffect(() => {
    if (user?.email && token) refreshPasswordLength(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, token]);

  const captureAvatar = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do aparatu.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      aspect: [1, 1],
      base64: false,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    if (asset?.uri) setAvatarUri(asset.uri);
  };

  const saveChanges = async () => {
    if (isSaving) return;

    if (!user?.email) {
      Alert.alert("Błąd", "Brak emaila zalogowanego użytkownika.");
      return;
    }
    if (!token) {
      Alert.alert("Błąd", "Brak tokena. Zaloguj się ponownie.");
      logout();
      return;
    }
    if (!editEmail.trim()) {
      Alert.alert("Błąd", "Email nie może być pusty.");
      return;
    }

    const wantsPasswordChange =
      isEditingPassword && editPassword.trim().length > 0;

    setIsSaving(true);
    try {
      const acc = await getAccountByEmail(user.email);
      const accountId = acc?.id;

      if (!accountId) {
        Alert.alert("Błąd", "Nie znaleziono konta dla zalogowanego emaila.");
        return;
      }

      const payload = { email: editEmail.trim() };
      if (wantsPasswordChange) payload.haslo = editPassword.trim();

      const res = await fetch(`${API.ACCOUNTS}/${accountId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error(`Update error: ${res.status}`);

      Alert.alert("Sukces", "Zapisano zmiany. Zaloguj się ponownie.");
      logout();
    } catch (e) {
      console.error(e);
      Alert.alert("Błąd", "Nie udało się zapisać zmian.");
    } finally {
      setIsSaving(false);
    }
  };

  // klik w pole hasła -> edycja (bez kasowania zawartości)
  const onPasswordPress = () => {
    if (!isEditingPassword) {
      setIsEditingPassword(true);
    }
  };

  return (
    <View style={[
                centeredContainerStyle,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
      <Text style={titleStyle}>Ustawienia</Text>

      <TouchableOpacity onPress={captureAvatar}>
        <Image
          source={
            avatarUri ? { uri: avatarUri } : require("../../assets/avatar.jpg")
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

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
        style={[input, width90, { marginTop: 10 }]}
        value={editEmail}
        onChangeText={setEditEmail}
        placeholder="E-mail"
        keyboardType="email-address"
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
        autoCapitalize="none"
      />

      <TextInput
        style={[input, width90]}
        value={isEditingPassword ? editPassword : MASK}
        onChangeText={setEditPassword}
        placeholder="Hasło"
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
        secureTextEntry={true}
        editable={isEditingPassword}
        onPressIn={onPasswordPress}
      />

      <TouchableOpacity
        style={[button, width90, { marginTop: 5, opacity: isSaving ? 0.6 : 1 }]}
        onPress={saveChanges}
        disabled={isSaving}
      >
        <Text style={buttonText}>
          {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[button, width90, { marginTop: 10 }]} onPress={logout}>
        <Text style={buttonText}>Wyloguj</Text>
      </TouchableOpacity>
    </View>
  );
}

