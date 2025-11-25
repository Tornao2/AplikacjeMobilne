import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useData } from "./DataContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function HistoryScreen() {
    const { theme } = useTheme();
    const { dataSets } = useData();
    const [categoryFilter, setCategoryFilter] = useState("Wszystko"); 
    const [typeFilter, setTypeFilter] = useState("Wszystko");
    const [dateFrom, setDateFrom] = useState(null); 
    const [dateTo, setDateTo] = useState(null); 
    const [sorting, setSorting] = useState("desc");
    const [isFromPickerVisible, setFromPickerVisible] = useState(false);
    const [isToPickerVisible, setToPickerVisible] = useState(false);
    const availableCategories = useMemo(() => {
        const categories = new Set();
        const relevantList = (dataSets.list || []).filter(item => 
            typeFilter === "Wszystko" || item.type === typeFilter
        );
        relevantList.forEach(item => {
            if (item.category) {
                categories.add(item.category);
            }
        });
        return ["Wszystko", ...Array.from(categories).sort()];
    }, [dataSets.list, typeFilter]); 

    const filtered = useMemo(() => {
        const from = dateFrom ? dateFrom.toISOString().split("T")[0] : null;
        const to = dateTo ? dateTo.toISOString().split("T")[0] : null;
        const list = dataSets.list || [];
        return list
            .filter((item) => {
                if (typeFilter !== "Wszystko" && item.type !== typeFilter) return false;
                if (categoryFilter !== "Wszystko" && item.category !== categoryFilter) return false;
                if (from && item.date < from) return false;
                if (to && item.date > to) return false;
                return true;
            })
            .sort((a, b) => {
                if (sorting === "desc") return b.date.localeCompare(a.date);
                return a.date.localeCompare(b.date);
            });
    }, [dateFrom, dateTo, dataSets.list, typeFilter, categoryFilter, sorting]); 
    const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
    const handleTypeFilterChange = (newType) => {
        setTypeFilter(newType);
        setCategoryFilter("Wszystko");
        setIsCategoryListVisible(false);
    }

    return (
        <ScrollView
            style={theme.containerStyle}
            contentContainerStyle={theme.centered}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
        >
            <Text style={theme.titleStyle}>Historia operacji</Text>
            <View style={[theme.centeredRow, theme.width90]}>
                {["Wszystko", "Wydatki", "Dochody"].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[theme.button, typeFilter === t && theme.pressedButton, { flex: 1 }]}
                        onPress={() => handleTypeFilterChange(t)}
                    >
                        <Text style={theme.buttonText}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[theme.width90, { marginBottom: 5 }]}>
                <TouchableOpacity
                    style={[theme.input, theme.spacedOutRow, { paddingRight: 15, marginTop: 3 }]}
                    onPress={() => setIsCategoryListVisible(!isCategoryListVisible)}
                >
                    <Text style={theme.smallTextStyle}>{categoryFilter}
                    </Text>
                    <Text style={theme.smallTextStyle}>
                        {isCategoryListVisible ? "▲" : "▼"}
                    </Text>
                </TouchableOpacity>
                {isCategoryListVisible && (
                    <View style={[theme.categoryListContainer,  {borderColor: theme.colors.border}]}>
                        <ScrollView nestedScrollEnabled={true}>
                            {availableCategories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={theme.categoryListItem}
                                    onPress={() => {
                                        setCategoryFilter(cat);
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
            <View style={[theme.centeredRow, theme.width90]}>
                <View style={[theme.centeredRow, theme.width45, { flex: 1, marginRight: 8 }]}>
                    <Text style={[theme.basicTextStyle, { fontSize: 18, marginBottom: 14 }]}>Od:</Text>
                    <TouchableOpacity
                        style={theme.input}
                        onPress={() => setFromPickerVisible(true)}
                    >
                        <Text style={{ color: dateFrom ? theme.colors.text : theme.darkMode ? "#777" : "#aaa" }}>
                            {dateFrom ? dateFrom.toISOString().split("T")[0] : "YYYY-MM-DD"}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isFromPickerVisible}
                        mode="date"
                        maximumDate={dateTo || undefined}
                        onConfirm={(date) => {
                            setDateFrom(date);
                            setFromPickerVisible(false);
                        }}
                        onCancel={() => {setDateFrom(null);setFromPickerVisible(false)}}
                    />
                </View>
                <View style={[theme.centeredRow, theme.width45, { flex: 1, marginLeft: 8 }]}>
                    <Text style={[theme.basicTextStyle, { fontSize: 20, marginBottom: 14 }]}>Do:</Text>
                    <TouchableOpacity
                        style={theme.input}
                        onPress={() => setToPickerVisible(true)}
                    >
                        <Text style={{ color: dateTo ? theme.colors.text : theme.darkMode ? "#777" : "#aaa" }}>
                            {dateTo ? dateTo.toISOString().split("T")[0] : "YYYY-MM-DD"}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isToPickerVisible}
                        mode="date"
                        minimumDate={dateFrom || undefined}
                        onConfirm={(date) => {
                            setDateTo(date);
                            setToPickerVisible(false);
                        }}
                        onCancel={() => {setDateTo(null);setToPickerVisible(false)}}
                    />
                </View>
            </View>
            <View style={[theme.centeredRow, theme.width90, {marginTop: 5}]}>
                <TouchableOpacity
                    style={[theme.button, sorting === "desc" && theme.pressedButton, {flex:1}]}
                    onPress={() => setSorting("desc")}
                >
                    <Text style={theme.buttonText}>Najnowsze</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[theme.button, sorting !== "desc" && theme.pressedButton, {flex:1}]}
                    onPress={() => setSorting("asc")}
                >
                    <Text style={theme.buttonText}>Najstarsze</Text>
                </TouchableOpacity>
            </View>
            <View style={[theme.width90]}>
                {filtered.length === 0 && (
                    <Text style={theme.basicTextStyle}>Brak wyników</Text>
                )}
                {filtered.map((item, index) => (
                    <View key={item.id ?? index} style={[theme.entryRow, { marginBottom: 2, paddingVertical: 6 }]}>
                        <View style={theme.columnItemContainer}>
                            <Text style={theme.basicTextStyle}>{item.name}</Text>
                            <Text style={theme.smallTextStyle}>Kategoria: {item.category || 'N/A'}</Text> 
                            <Text style={[theme.basicTextStyle, { fontSize: 12, opacity: 0.7 }]}>
                                {item.date}
                            </Text>
                        </View>
                        <Text style={{
                            color: item.type === "Dochody" ? "green" : "red",
                            fontWeight: "700",
                        }}>
                            {item.amount} zł
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}