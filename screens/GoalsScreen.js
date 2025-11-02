import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";

export default function GoalsScreen() {
  const [goals, setGoals] = useState([
    { name: "Samochód", saved: 5000, target: 10000 },
    { name: "Wakacje", saved: 1000, target: 5000 },
    { name: "Mieszkanie", saved: 0, target: 350000 }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [target, setTarget] = useState("");

  const addGoal = () => {
    if (!newGoal || !target) return alert("Podaj nazwę i kwotę celu.");
    const goal = { name: newGoal, saved: 0, target: parseFloat(target) };
    setGoals([...goals, goal]);
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
      <Text style={styles.title}>Twoje cele finansowe</Text>

      {/* Dodawanie nowego celu */}
      {showAddForm && (
        <View style={styles.addContainer}>
          <TextInput
            placeholder="Nazwa celu"
            style={styles.input}
            value={newGoal}
            onChangeText={setNewGoal}
          />
          <TextInput
            placeholder="Kwota docelowa"
            style={styles.input}
            keyboardType="numeric"
            value={target}
            onChangeText={setTarget}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={addGoal}>
              <Text style={styles.saveButtonText}>Zapisz cel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#FF3B30" }]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.saveButtonText}>✖ Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Przycisk „Dodaj cel” */}
      {!showAddForm && (
        <TouchableOpacity
          style={styles.addGoalButton}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addGoalButtonText}>Dodaj cel</Text>
        </TouchableOpacity>
      )}

      {/* Lista celów */}
      <ScrollView style={styles.scroll}>
        {goals.map((goal, index) => {
          const progress = (goal.saved / goal.target) * 100;
          return (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalAmount}>
                  {goal.saved} zł ({progress.toFixed(2)}%) ➜ {goal.target} zł
                </Text>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "#34C759" }]}
                  onPress={() => updateProgress(index, 100)}
                >
                  <Text style={styles.saveButtonText}>+100 zł</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "#FF9500" }]}
                  onPress={() => updateProgress(index, -100)}
                >
                  <Text style={styles.saveButtonText}>-100 zł</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "#FF3B30" }]}
                  onPress={() => deleteGoal(index)}
                >
                  <Text style={styles.saveButtonText}>Usuń cel</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15, textAlign: "center" },

  addGoalButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addGoalButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  addContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  formButtons: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },

  scroll: { flex: 1 },
  goalCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  goalHeader: { marginBottom: 10 },
  goalName: { fontSize: 18, fontWeight: "600" },
  goalAmount: { color: "#555" },
  progressBar: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#007AFF" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
