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
import { useAuth } from "../AuthContext";

export default function EditScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { addToList } = useData();
  const [type, setType] = useState("Wydatki");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(""); 
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
  const { user } = useAuth();

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  };

  const currentCategories = useMemo(() => {
    return type === "Wydatki" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  }, [type]);

  const handleSetType = (newType) => {
    setType(newType);
    setCategory(""); 
    setIsCategoryListVisible(false); 
  }

  const addEntry = useCallback(async () => {
    if (!name.trim() || !amount) {
      Alert.alert("Błąd", "Uzupełnij nazwę i kwotę");
      return;
    }
    if (!category || !currentCategories.includes(category)) {
      Alert.alert("Błąd", "Wybierz kategorię z listy");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Błąd", "Kwota musi być liczbą większą od zera");
      return;
    }
    const newEntry = {
      name: name.trim(),
      amount: parsedAmount,
      date: new Date().toISOString().split("T")[0],
      type,
      category,
      color: generateRandomColor(),
      user_id: user.id
    };
    await addToList(newEntry);
    setName("");
    setAmount("");
    setCategory("");
    setIsCategoryListVisible(false);

    navigation.goBack();
  }, [name, amount, type, category, currentCategories, addToList, navigation]);

  return (
    <ScrollView 
        contentContainerStyle={theme.centeredContainerStyle}
        keyboardShouldPersistTaps="handled"
    >
      <Text style={theme.titleStyle}>Edycja</Text>
      <View style={[theme.spacedOutRow, theme.width90]}>
        {["Wydatki", "Dochody"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[theme.button, type === t && theme.pressedButton, {flex:1}]}
            onPress={() => handleSetType(t)} 
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
      <View style={[theme.width90, { marginTop: 5 }]}>
          <Text style={[theme.basicTextStyle, { marginBottom: 10 }]}>
              Kategoria ({type}):
          </Text>
          <TouchableOpacity
              style={[theme.input, theme.spacedOutRow, {paddingRight: 10}]}
              onPress={() => setIsCategoryListVisible(!isCategoryListVisible)}
          >
              <Text style={theme.smallTextStyle}>
                  {category || "Wybierz kategorię..."}
              </Text>
              <Text style={theme.smallTextStyle}>
                {isCategoryListVisible ? "▲" : "▼"}
              </Text>
          </TouchableOpacity>
          {isCategoryListVisible && (
            <View style={[theme.categoryListContainer, {borderColor: theme.colors.border}]}>
                <ScrollView >
                    {currentCategories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[ theme.categoryListItem,]}
                            onPress={() => {
                                setCategory(cat);
                                setIsCategoryListVisible(false); 
                            }}
                        >
                            <Text style={theme.smallTextStyle}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
          )}

      </View>
      <TouchableOpacity 
          style={[theme.button, theme.width90, { marginTop: 10 }]} 
          onPress={addEntry}
      >
        <Text style={theme.buttonText}>Dodaj {type}</Text>
      </TouchableOpacity>
      <View style={[theme.footer, theme.width90]}>
        <TouchableOpacity style={[theme.button, theme.width90]} onPress={() => navigation.goBack()}>
          <Text style={theme.buttonText}>Powrót</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}