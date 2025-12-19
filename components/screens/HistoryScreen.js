import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useData } from "./DataContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const toISODate = (d) => d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null;

export default function HistoryScreen() {
    const { theme } = useTheme();
    const { dataSets } = useData();
    const [filters, setFilters] = useState({ category: "Wszystko", type: "Wszystko", from: null, to: null, sorting: "desc" });
    const [picker, setPicker] = useState({ visible: false, target: null });
    const [isCategoryVisible, setIsCategoryVisible] = useState(false);

    const availableCategories = useMemo(() => {
        const cats = new Set((dataSets?.list || [])
            .filter(i => filters.type === "Wszystko" || i.type === filters.type)
            .map(i => i.category).filter(Boolean));
        return ["Wszystko", ...Array.from(cats).sort()];
    }, [dataSets?.list, filters.type]);

    const filtered = useMemo(() => {
        const from = toISODate(filters.from);
        const to = toISODate(filters.to);
        return (dataSets?.list || [])
            .filter(i => (filters.type === "Wszystko" || i.type === filters.type) &&
                         (filters.category === "Wszystko" || i.category === filters.category) &&
                         (!from || i.date >= from) && (!to || i.date <= to))
            .sort((a, b) => filters.sorting === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    }, [dataSets?.list, filters]);

    const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

    return (
        <ScrollView style={theme.containerStyle} contentContainerStyle={theme.centered}>
            <Text style={theme.titleStyle}>Historia operacji</Text>
            <View style={[theme.centeredRow, theme.width90]}>
                {["Wszystko", "Wydatki", "Dochody"].map(t => (
                    <TouchableOpacity key={t} style={[theme.button, filters.type === t && theme.pressedButton, { flex: 1 }]} 
                        onPress={() => setFilters({ ...filters, type: t, category: "Wszystko" })}>
                        <Text style={theme.buttonText}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {filters.type !== "Wszystko" && (
                <View style={theme.width90}>
                    <TouchableOpacity style={[theme.input, theme.spacedOutRow]} onPress={() => setIsCategoryVisible(!isCategoryVisible)}>
                        <Text style={theme.smallTextStyle}>{filters.category}</Text>
                        <Text style={theme.smallTextStyle}>{isCategoryVisible ? "▲" : "▼"}</Text>
                    </TouchableOpacity>
                    {isCategoryVisible && (
                        <View style={theme.categoryListContainer}>
                            {availableCategories.map(cat => (
                                <TouchableOpacity key={cat} style={theme.categoryListItem} onPress={() => { updateFilter('category', cat); setIsCategoryVisible(false); }}>
                                    <Text style={theme.smallTextStyle}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            )}
            <View style={[theme.centeredRow, theme.width90]}>
                {['from', 'to'].map(target => (
                    <View key={target} style={{ flex: 1, marginHorizontal: 4 }}>
                        <Text style={theme.basicTextStyle}>{target === 'from' ? 'Od:' : 'Do:'}</Text>
                        <TouchableOpacity style={theme.input} onPress={() => setPicker({ visible: true, target })}>
                            <Text style={{ color: filters[target] ? theme.colors.text : "#aaa" }}>
                                {toISODate(filters[target]) || "RRRR-MM-DD"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={[theme.centeredRow, theme.width90, { marginTop: 10 }]}>
                {[{id: 'desc', l: 'Najnowsze'}, {id: 'asc', l: 'Najstarsze'}].map(s => (
                    <TouchableOpacity key={s.id} style={[theme.button, filters.sorting === s.id && theme.pressedButton, { flex: 1 }]} 
                        onPress={() => updateFilter('sorting', s.id)}>
                        <Text style={theme.buttonText}>{s.l}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[theme.width90, { marginTop: 10, paddingBottom: 20 }]}>
                {filtered.length === 0 ? <Text style={theme.titleStyle}>Brak wyników</Text> : 
                    filtered.map((item, idx) => (
                        <View key={item.id ?? idx} style={[theme.entryRow, { paddingVertical: 8 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={theme.basicTextStyle}>{item.name}</Text>
                                <Text style={theme.smallTextStyle}>{item.category || 'N/A'} • {item.date}</Text>
                            </View>
                            <Text style={{ color: item.type === "Dochody" ? "green" : "red", fontWeight: "700" }}>
                                {item.type === "Dochody" ? "+" : "-"}{item.amount} zł
                            </Text>
                        </View>
                    ))
                }
            </View>
            <DateTimePickerModal
                isVisible={picker.visible}
                mode="date"
                date={filters[picker.target] || new Date()}
                onConfirm={(date) => { updateFilter(picker.target, date); setPicker({ visible: false, target: null }); }}
                onCancel={() => { updateFilter(picker.target, null); setPicker({ visible: false, target: null }); }}
            />
        </ScrollView>
    );
}