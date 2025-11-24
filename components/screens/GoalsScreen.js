import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GoalsStyles";

const GoalItem = ({ goal, index, updateProgress, deleteGoal, theme, styles }) => {
  const [changeAmount, setChangeAmount] = useState("");
  const handleTransaction = (multiplier) => {
    const value = parseFloat(changeAmount);
    if (!isNaN(value) && value > 0 ) {
      updateProgress(index, value * multiplier);
      setChangeAmount(""); 
    }
  };
  const progress = (goal.saved / goal.target) * 100;
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={[theme.basicTextStyle, {textAlign: "center"}]}>{goal.name}</Text>
        <Text style={[theme.basicTextStyle, {textAlign: "center"}]}>
          {goal.saved} zł ({progress.toFixed(2)}%) ➜ {goal.target} zł
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={[theme.spacedOutRow, {marginTop: 10}]}>
        <TextInput
          style={[theme.input, { flex: 1, textAlign: 'center' }]}
          placeholder="Kwota"
          placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
          keyboardType="numeric"
          value={changeAmount}
          onChangeText={setChangeAmount}
        />
        <TouchableOpacity
          style={[theme.button, { width: 50, backgroundColor: "green"}]}
          onPress={() => handleTransaction(1)}
        >
          <Text style={theme.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.button, { width: 50, backgroundColor: "orange" }]}
          onPress={() => handleTransaction(-1)}
        >
          <Text style={theme.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.button, {width: 50, backgroundColor: "red"}]}
          onPress={() => deleteGoal(index)}
        >
          <Text style={theme.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function GoalsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [goals, setGoals] = useState([
    { name: "Samochód", saved: 5000, target: 10000 },
    { name: "Wakacje", saved: 1000, target: 5000 },
    { name: "Mieszkanie", saved: 0, target: 350000 },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [target, setTarget] = useState("");
  const addGoal = () => {
    if (!newGoal || !target) return alert("Podaj nazwę i kwotę celu.");
    setGoals([...goals, { name: newGoal, saved: 0, target: parseFloat(target) }]);
    setNewGoal("");
    setTarget("");
    setShowAddForm(false);
  };
  const deleteGoal = (index) => {
    Alert.alert(
      "Usuń cel", `Czy na pewno chcesz usunąć cel "${goals[index].name}"?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => {
            const updated = [...goals];
            updated.splice(index, 1);
            setGoals(updated);
          },
        },
      ]
    );
  };

  const updateProgress = (index, amount) => {
    const updated = [...goals];
    const newAmount = updated[index].saved + amount;
    if (newAmount > updated[index].target)
      return;
    updated[index].saved = Math.max(0, newAmount); 
    setGoals(updated);
  };

  return (
    <View style={[theme.centeredContainerStyle]}>
      <Text style={theme.titleStyle}>Twoje cele</Text>
      {showAddForm && (
        <View style={[theme.colors.background, theme.borders, theme.width90]}>
          <TextInput
            placeholder="Nazwa celu"
            style={theme.input}
            value={newGoal}
            onChangeText={setNewGoal}
            placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
          />
          <TextInput
            placeholder="Kwota docelowa"
            style={theme.input}
            keyboardType="numeric"
            value={target}
            onChangeText={setTarget}
            placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
          />
          <View style={theme.spacedOutRow}>
            <TouchableOpacity style={theme.button} onPress={addGoal}>
              <Text style={theme.buttonText}>Zapisz cel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[theme.button, { flex: 1, backgroundColor: "red" }]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={theme.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!showAddForm && (
        <TouchableOpacity style={[theme.button, theme.width90]} onPress={() => setShowAddForm(true)}>
          <Text style={theme.buttonText}>Dodaj cel</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={theme.width90}>
        {goals.map((goal, index) => (
          <GoalItem
            key={index}
            index={index}
            goal={goal}
            updateProgress={updateProgress}
            deleteGoal={deleteGoal}
            theme={theme}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
}