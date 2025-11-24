import { useState, useCallback } from "react"; 
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"; 
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { useData } from "./DataContext";
export default function EditScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { addToList } = useData();
  
  const [type, setType] = useState("Wydatki");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  };
  const addEntry = useCallback(() => {
    if (!name.trim() || !amount) {
      Alert.alert("Błąd", "Uzupełnij nazwę i kwotę!");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Błąd", "Kwota musi być poprawną liczbą większą od zera!");
      return;
    }
    addToList({
      id: Date.now(), 
      name: name.trim(),
      amount: parsedAmount,
      date: new Date().toISOString().split("T")[0],
      type,
      color: generateRandomColor(),
    });
    setName("");
    setAmount("");
    navigation.goBack();
  }, [name, amount, type, addToList, navigation]);
  return (
    <View style={theme.centeredContainerStyle}>
      <Text style={theme.titleStyle}>Edycja</Text>
      <View style={[theme.spacedOutRow, theme.width90]}>
        {["Wydatki", "Dochody"].map((t) => (
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
        placeholder={`Nazwa ${type === "Wydatki" ? "wydatku" : "dochodu"}`}
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.colors.text} 
      />
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Kwota (zł)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholderTextColor={theme.colors.text} 
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