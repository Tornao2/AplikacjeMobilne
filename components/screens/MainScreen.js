import React, { useState, useMemo } from "react"; 
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native"; 
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/MainStyles";
import { useData } from "./DataContext";

const DISTINCT_COLORS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", 
    "#FF9F40", "#C9CB3F", "#E7E9ED", "#8BC34A", "#E91E63", 
    "#00BCD4", "#FF5722"
];

export default function MainScreen() {
    const [expandedCategories, setExpandedCategories] = useState({});
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme); 
    const [period, setPeriod] = useState("miesiąc");
    const [type, setType] = useState("Wydatki"); 
    const { dataSets } = useData();
    const screenWidth = Dimensions.get("window").width;
    const now = new Date();

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const { groupedData, total, filteredData } = useMemo(() => {
        const list = dataSets?.list || [];
        const acc = {};
        let totalSum = 0;
        const filtered = list.filter(item => {
            if (item.type !== type) return false;
            const d = new Date(item.date);
            if (period === "dzień") {
                return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }
            if (period === "miesiąc") {
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }
            if (period === "rok") {
                return d.getFullYear() === now.getFullYear();
            }
            return true;
        });
        filtered.forEach(item => {
            const catName = item.category || "Inne";
            if (!acc[catName]) {
                acc[catName] = { category: catName, amount: 0, entries: [] };
            }
            acc[catName].amount += item.amount;
            acc[catName].entries.push(item);
            totalSum += item.amount;
        });
        const grouped = Object.values(acc).map((item, index) => ({
            ...item,
            color: DISTINCT_COLORS[index % DISTINCT_COLORS.length]
        }));
        return { groupedData: grouped, total: totalSum, filteredData: filtered };
    }, [dataSets?.list, type, period]);

    return (
        <ScrollView 
            style={theme.containerStyle}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[theme.spacedOutRow, theme.width90, {marginTop: 10, marginBottom: 5}]}>
                {["Wydatki", "Dochody"].map((p) => (
                    <TouchableOpacity key={p} style={[theme.button, type === p && theme.pressedButton, {flex: 1}]} onPress={() => setType(p)}>
                        <Text style={[theme.buttonText, type === p && styles.activePeriodText]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[theme.spacedOutRow, theme.width90, {marginBottom: 10}]}>
                {["dzień", "miesiąc", "rok"].map((p) => (
                    <TouchableOpacity key={p} style={[theme.button, period === p && theme.pressedButton, {flex: 1}]} onPress={() => setPeriod(p)}>
                        <Text style={[theme.buttonText, period === p && styles.activePeriodText]}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {groupedData.length > 0 ? (
                <PieChart
                    data={groupedData.map((item) => ({
                        name: item.category,
                        population: item.amount,
                        color: item.color,
                        legendFontColor: theme.colors.text,
                        legendFontSize: 12,
                    }))}
                    width={screenWidth}
                    height={220}
                    accessor="population"
                    backgroundColor="transparent"
                    chartConfig={{ color: () => theme.colors.text }}
                    hasLegend={false}
                    center={[screenWidth / 4, 0]}
                />
            ) : (
                <View style={{ height: 220, justifyContent: "center" }}>
                    <Text style={[theme.titleStyle, { opacity: 0.5 }]}>Brak danych</Text>
                </View>
            )}
            <Text style={[theme.biggerTextStyle, { marginVertical: 10 }]}>
                Suma: {total.toFixed(2)} zł
            </Text>
            <View style={theme.width90}>
                {groupedData.map((item, index) => {
                    const percent = (total > 0 ? (item.amount / total) * 100 : 0).toFixed(1);
                    const isExpanded = expandedCategories[item.category];
                    return (
                        <View key={index} style={[theme.entryRow, { flexDirection: "column", paddingVertical: 12 }]}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}
                                onPress={() => toggleCategory(item.category)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 2, marginRight: 10 }} />
                                    <Text style={theme.basicTextStyle}>{item.category}</Text>
                                </View>
                                <Text style={theme.basicTextStyle}>{item.amount.toFixed(2)} zł ({percent}%)</Text>
                            </TouchableOpacity>
                            {isExpanded && (
                                <View style={{ 
                                    width: "100%", 
                                    marginTop: 10, 
                                    paddingLeft: 22, 
                                    borderLeftWidth: 3, 
                                    borderLeftColor: item.color,
                                    marginLeft: 5 
                                }}>
                                    {item.entries.map((entry, i) => (
                                        <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={theme.smallTextStyle}>{entry.name || "Bez nazwy"}</Text>
                                                <Text style={[theme.smallTextStyle, { fontSize: 10, opacity: 0.6 }]}>{entry.date}</Text>
                                            </View>
                                            <Text style={[theme.smallTextStyle, { fontWeight: '600' }]}>{entry.amount.toFixed(2)} zł</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
            <TouchableOpacity
                style={[theme.button, theme.width90, { marginTop: 25, marginBottom: 20 }]}
                onPress={() => navigation.navigate("Edit")}
            >
                <Text style={theme.buttonText}>Dodaj</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}