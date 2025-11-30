import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GoalsStyles";

import { API } from "../api";
export const GOALS_ENDPOINT = API.GOALS;

const GoalItem = ({ goal, index, updateProgress, deleteGoal, theme, styles }) => {
  const [changeAmount, setChangeAmount] = useState("");
  const handleTransaction = (multiplier) => {
    const value = parseFloat(changeAmount);
    if (!isNaN(value) && value > 0 ) {
      updateProgress(goal, value * multiplier)
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
          onPress={() => deleteGoal(goal.id, goal.name)}
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
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(GOALS_ENDPOINT);
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Błąd pobierania celów:", error);
    }
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [target, setTarget] = useState("");
  const addGoal = async () => {
    if (!newGoal || !target) {
      Alert.alert("Błąd", "Podaj nazwę i kwotę celu.");
      return;
    }

    try {
      const response = await fetch(GOALS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGoal,
          saved: 0,
          target: parseFloat(target)
        })
      });

      if (response.ok) {
        fetchGoals();
        setNewGoal("");
        setTarget("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Błąd dodawania celu:", error);
    }
  };
  const deleteGoal = (id, name) => {
    Alert.alert(
      "Usuń cel",
      `Czy na pewno chcesz usunąć cel "${name}"?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${GOALS_ENDPOINT}/${id}`, {
                method: "DELETE"
              });
              fetchGoals();
            } catch (error) {
              console.error("Błąd usuwania celu:", error);
            }
          }
        }
      ]
    );
  };

  const updateProgress = async (goal, amount) => {
  const newSaved = goal.saved + amount;

  if (newSaved < 0 || newSaved > goal.target) return;

  try {
    await fetch(`${GOALS_ENDPOINT}/${goal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saved: newSaved })
    });

    fetchGoals();
  } catch (error) {
    console.error("Błąd aktualizacji celu:", error);
  }
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