import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GoalsStyles";

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
      "Usuń cel",
      `Czy na pewno chcesz usunąć cel "${goals[index].name}"?`,
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
    updated[index].saved = Math.max(0, Math.min(newAmount, updated[index].target));
    setGoals(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje cele</Text>

      {showAddForm && (
        <View style={[theme.input, theme.colors.background]}>
          <TextInput
            placeholder="Nazwa celu"
            style={theme.input}
            value={newGoal}
            onChangeText={setNewGoal}
          />
          <TextInput
            placeholder="Kwota docelowa"
            style={theme.input}
            keyboardType="numeric"
            value={target}
            onChangeText={setTarget}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={theme.button} onPress={addGoal}>
              <Text style={theme.buttonText}>Zapisz cel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "red" }]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={theme.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!showAddForm && (
        <TouchableOpacity style={theme.button} onPress={() => setShowAddForm(true)}>
          <Text style={theme.buttonText}>Dodaj cel</Text>
        </TouchableOpacity>
      )}

      <ScrollView>
        {goals.map((goal, index) => {
          const progress = (goal.saved / goal.target) * 100;
          return (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={theme.basicTextStyle}>{goal.name}</Text>
                <Text style={theme.basicTextStyle}>
                  {goal.saved} zł ({progress.toFixed(2)}%) ➜ {goal.target} zł
                </Text>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "lime" }]}
                  onPress={() => updateProgress(index, 100)}
                >
                  <Text style={theme.buttonText}>+100 zł</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "orange" }]}
                  onPress={() => updateProgress(index, -100)}
                >
                  <Text style={theme.buttonText}>-100 zł</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "red" }]}
                  onPress={() => deleteGoal(index)}
                >
                  <Text style={theme.buttonText}>Usuń cel</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
