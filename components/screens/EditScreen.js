import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";

import { useData } from "./DataContext";

export default function EditScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { addToList } = useData();

  const [type, setType] = useState("wydatki");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

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
    <View style={theme.centeredContainerStyle}>
      <Text style={theme.titleStyle}>Edycja</Text>
      <View style={[theme.spacedOutRow, theme.width90]}>
        {["wydatki", "dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[theme.button, type === t && theme.pressedButton, {flex:1}]}
            onPress={() => setType(t)}
          >
            <Text style={[theme.buttonText]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder={`Nazwa ${type === "wydatki" ? "wydatku" : "dochodu"}`}
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Kwota (zł)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TouchableOpacity style={[theme.button, theme.width90]} onPress={addEntry}>
        <Text style={theme.buttonText}>Dodaj {type}</Text>
      </TouchableOpacity>
      <View style={[theme.footer, theme.width90]}>
        <TouchableOpacity style={[theme.button, theme.width90]} onPress={() => navigation.goBack()}>
          <Text style={theme.buttonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
