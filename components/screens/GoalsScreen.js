import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GoalsStyles";
import { useAuth } from "../AuthContext";
import { API } from "../api";
import useApi from "../protectedFetch";

export const GOALS_ENDPOINT = API.GOALS;

const cleanNumber = (text) => text.replace(/[^0-9.,]/g, '').replace(',', '.');
const GoalItem = ({ goal, updateProgress, deleteGoal, theme, styles }) => {
  const [changeAmount, setChangeAmount] = useState("");
  const progress = (goal.saved / goal.target) * 100;
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={[theme.basicTextStyle, {textAlign: "center"}]}>{goal.name}</Text>
        <Text style={[theme.basicTextStyle, {textAlign: "center"}]}>
          {goal.saved.toFixed(2)} zł ({progress.toFixed(2)}%) ➜ {goal.target} zł
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
      </View>
      <View style={[theme.spacedOutRow, {marginTop: 10}]}>
        <TextInput
          style={[theme.input, { flex: 1, textAlign: 'center' }]}
          placeholder="Kwota"
          placeholderTextColor={theme.darkMode ? "#777" : "#aaa"}
          keyboardType="decimal-pad" 
          value={changeAmount}
          onChangeText={(t) => setChangeAmount(cleanNumber(t))} 
        />
        <TouchableOpacity style={[theme.button, { width: 50, backgroundColor: "green"}]}
          onPress={() => {
            const val = parseFloat(changeAmount);
            if (!isNaN(val)) { updateProgress(goal, val); setChangeAmount(""); }
          }}>
          <Text style={theme.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[theme.button, { width: 50, backgroundColor: "orange" }]}
          onPress={() => {
            const val = parseFloat(changeAmount);
            if (!isNaN(val)) { updateProgress(goal, -val); setChangeAmount(""); }
          }}>
          <Text style={theme.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[theme.button, {width: 50, backgroundColor: "red"}]}
          onPress={() => deleteGoal(goal.id, goal.name)}>
          <Text style={theme.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function GoalsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { token } = useAuth();
  const { authorizedFetch } = useApi(); 
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [target, setTarget] = useState("");

  const fetchGoals = useCallback(async () => {
    if (!token) return;
    try {
      const response = await authorizedFetch(GOALS_ENDPOINT);
      const data = await response.json();
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
  }, [token, authorizedFetch]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const addGoal = async () => {
    const targetValue = parseFloat(target);
    if (!newGoal || isNaN(targetValue)) return Alert.alert("Błąd", "Wypełnij pola.");
    try {
      await authorizedFetch(GOALS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ name: newGoal, saved: 0, target: targetValue })
      });
      fetchGoals();
      setNewGoal(""); setTarget(""); setShowAddForm(false);
    } catch (e) { Alert.alert("Błąd dodawania"); }
  };

  const updateProgress = async (goal, amount) => {
    const newSaved = goal.saved + amount;
    if (newSaved < 0 || newSaved > goal.target) return Alert.alert("Błąd", "Wartość poza zakresem.");
    try {
      const res = await authorizedFetch(`${GOALS_ENDPOINT}/${goal.id}`, {
        method: "PATCH",
        body: JSON.stringify({ saved: newSaved })
      });
      if (res.ok) fetchGoals();
      else {
        const errData = await res.json();
        Alert.alert("Błąd", errData.error || "Brak uprawnień");
      }
    } catch (e) { Alert.alert("Błąd serwera"); }
  };

  const deleteGoal = (id, name) => {
    Alert.alert("Usuń", `Usunąć ${name}?`, [
      { text: "Anuluj" },
      { text: "Usuń", style: "destructive", onPress: async () => {
          await authorizedFetch(`${GOALS_ENDPOINT}/${id}`, { method: "DELETE" });
          fetchGoals();
      }}
    ]);
  };

  return (
    <View style={theme.centeredContainerStyle}>
      <Text style={theme.titleStyle}>Twoje cele</Text>
      {showAddForm ? (
        <View style={[theme.colors.background, theme.borders, theme.width90, { padding: 10 }]}>
          <TextInput style={theme.input} placeholder="Nazwa" placeholderTextColor={theme.colors.text} value={newGoal} onChangeText={setNewGoal} />
          <TextInput style={theme.input} placeholder="Kwota" placeholderTextColor={theme.colors.text} keyboardType="decimal-pad" value={target} onChangeText={t => setTarget(cleanNumber(t))} />
          <View style={theme.spacedOutRow}>
            <TouchableOpacity style={[theme.button, { flex: 1 }]} onPress={addGoal}><Text style={theme.buttonText}>Zapisz</Text></TouchableOpacity>
            <TouchableOpacity style={[theme.button, { flex: 1, backgroundColor: "red" }]} onPress={() => setShowAddForm(false)}><Text style={theme.buttonText}>Anuluj</Text></TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={[theme.button, theme.width90]} onPress={() => setShowAddForm(true)}>
          <Text style={theme.buttonText}>Dodaj cel</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={[theme.width90, { marginTop: 15 }]}>
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} updateProgress={updateProgress} deleteGoal={deleteGoal} theme={theme} styles={styles} />
        ))}
      </ScrollView>
    </View>
  );
}