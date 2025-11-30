import { useState, useMemo } from "react"; 
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native"; 
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/MainStyles";
import { useData } from "./DataContext";

const groupDataByCategory = (data) => {
    return data.reduce((acc, item) => {
        const categoryName = item.category || "Brak Kategorii";
        const categoryColor = item.color; 
        const existingCategory = acc.find(cat => cat.category === categoryName);
        if (existingCategory) {
            existingCategory.amount += item.amount;
        } else {
            acc.push({
                category: categoryName,
                amount: item.amount,
                color: categoryColor,
            });
        }
        return acc;
    }, []);
};

export default function MainScreen() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme); 
    const [period, setPeriod] = useState("miesiąc");
    const [type, setType] = useState("Wydatki"); 
    const { dataSets } = useData();
    const screenWidth = Dimensions.get("window").width;
    const now = new Date();

    function filterByPeriod(list) {
        return (list || []).filter(item => {
            const d = new Date(item.date);
            if (period === "dzień") {
                return (
                    d.getDate() === now.getDate() &&
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );
            }
            if (period === "miesiąc") {
                return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );
            }
            if (period === "rok") {
                return d.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }

    const filteredData = filterByPeriod(dataSets.list || []).filter(item => item.type === type);
    const groupedData = useMemo(() => groupDataByCategory(filteredData), [filteredData]);
    const total = groupedData.reduce((sum, item) => sum + item.amount, 0);


    return (
        <ScrollView
            contentContainerStyle={theme.centeredContainerStyle}
        >
            <View style={[theme.spacedOutRow, theme.width90, {marginBottom: 2}]}>
                {["Wydatki", "Dochody"].map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[theme.button, type === p && theme.pressedButton, {flex:1}]}
                        onPress={() => setType(p)}
                    >
                        <Text style={[theme.buttonText, type === p && styles.activePeriodText]}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[theme.spacedOutRow, theme.width90, {marginBottom: 2}]}>
                {["dzień", "miesiąc", "rok"].map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[theme.button, period === p && theme.pressedButton, {flex:1, marginBottom: 0}]}
                        onPress={() => setPeriod(p)}
                    >
                        <Text style={[theme.buttonText, period === p && styles.activePeriodText]}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {groupedData.length > 0 ? (
                <View>
                    <PieChart
                        data={groupedData.map((item) => ({
                            name: item.category,
                            population: item.amount,
                            color: item.color,
                            legendFontColor: theme.colors.text,
                            legendFontSize: 14,
                        }))}
                        width={screenWidth}
                        height={250}
                        accessor="population"
                        backgroundColor="transparent"
                        chartConfig={{ color: () => theme.colors.text }}
                        hasLegend={false}
                        center={[screenWidth/4, 0]}
                    />
                </View>
            ) : (
                <View
                    style={{
                        width: 250,
                        height: 250,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={[{ color: theme.colors.text, fontSize: 32,}]}>Brak danych</Text>
                </View>
            )}
            <Text style={[theme.biggerTextStyle, {marginTop: 5}]}>
                Łączna suma {type === "Dochody" ? "dochodów" : "wydatków"}: {total.toFixed(2)} zł
            </Text>
            <ScrollView style={[theme.width90, {marginBottom: 10, maxHeight: "50%", marginTop: 15}]}>
                {groupedData.map((item, index) => {
                    const percent = (total > 0 ? (item.amount / total) * 100 : 0).toFixed(2);
                    return (
                        <View key={index} style={theme.entryRow}>
                            <Text style={styles.itemName}>
                                <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 6 }} />
                                {' '}{item.category}
                            </Text>
                            <Text style={theme.basicTextStyle}>{percent}%</Text>
                            <Text style={styles.itemAmount}>{item.amount.toFixed(2)} zł</Text>
                        </View>
                    );
                })}
            </ScrollView>
            <TouchableOpacity
                style={[theme.button, theme.footer, theme.width90, {paddingVertical: 8}]}
                onPress={() => navigation.navigate("Edit")}
            >
                <Text style={[theme.buttonText]}>Dodaj</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}