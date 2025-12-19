import { useState, useCallback, useMemo } from "react"; 
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView,
} from "react-native"; 
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { useData, EXPENSE_CATEGORIES, INCOME_CATEGORIES} from "./DataContext";
import { API } from "../api";
export const LIST_ENDPOINT = API.LIST;

export default function EditScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { addToList } = useData();
  const [formData, setFormData] = useState({
    type: "Wydatki",
    name: "",
    amount: "",
    category: ""
  });
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const currentCategories = useMemo(() => 
    formData.type === "Wydatki" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  , [formData.type]);
  const addEntry = useCallback(async () => {
    const { name, amount, category, type } = formData;
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!name.trim() || isNaN(parsedAmount) || !category) {
      Alert.alert("Błąd", "Wypełnij poprawnie wszystkie pola");
      return;
    }
    await addToList({
      name: name.trim(),
      amount: parsedAmount,
      date: new Date().toISOString().split("T")[0],
      type,
      category,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    });
    navigation.goBack();
  }, [formData, addToList, navigation]);
  return (
    <ScrollView contentContainerStyle={theme.centeredContainerStyle} keyboardShouldPersistTaps="handled">
      <Text style={theme.titleStyle}>Nowy Wpis</Text>
      <View style={[theme.spacedOutRow, theme.width90]}>
        {["Wydatki", "Dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[theme.button, formData.type === t && theme.pressedButton, { flex: 1 }]}
            onPress={() => setFormData(prev => ({ ...prev, type: t, category: "" }))}
          >
            <Text style={theme.buttonText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Nazwa..."
        value={formData.name}
        onChangeText={(v) => updateForm("name", v)}
        placeholderTextColor={theme.colors.text}
      />
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Kwota (zł)"
        keyboardType="numeric"
        value={formData.amount}
        onChangeText={(v) => updateForm("amount", v)}
        placeholderTextColor={theme.colors.text}
      />
      <View style={[theme.width90, { marginTop: 5 }]}>
        <TouchableOpacity
          style={[theme.input, theme.spacedOutRow]}
          onPress={() => setIsCategoryListVisible(!isCategoryListVisible)}
        >
          <Text style={theme.smallTextStyle}>{formData.category || "Wybierz kategorię..."}</Text>
          <Text style={theme.smallTextStyle}>{isCategoryListVisible ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        {isCategoryListVisible && (
          <View style={theme.categoryListContainer}>
            {currentCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={theme.categoryListItem}
                onPress={() => {
                  updateForm("category", cat);
                  setIsCategoryListVisible(false);
                }}
              >
                <Text style={theme.smallTextStyle}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity style={[theme.button, theme.width90]} onPress={addEntry}>
        <Text style={theme.buttonText}>Zapisz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}