import { addShoppingListItem, clearShoppingList, getShoppingList, removeShoppingListItem, renameShoppingListItem } from "@/src/repositories/shoppingListRepository";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ShoppingList() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const loadData = useCallback(() => {
    setItems(getShoppingList());
    setCheckedIds(new Set());
    setEditingId(null);
  }, []);
  useFocusEffect(loadData);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const result = addShoppingListItem(name);
    if (result.duplicateExists) Alert.alert('Heads up', `You already have ${name} in active tracking.`);
    setNewName("");
    loadData();
  };

  const handleClearAll = () => Alert.alert('Clear All', 'Remove everything from your shopping list?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear', style: 'destructive', onPress: () => { clearShoppingList(); loadData(); } },
  ]);

  const toggleCheck = (id) => setCheckedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const saveEdit = () => {
    if (editingName.trim() && editingId) { renameShoppingListItem(editingId, editingName.trim()); loadData(); }
    setEditingId(null);
  };

  return (
    <View style={styles.container}>

      <View style={styles.Shopping_listHeader}>
        <Text style={styles.Shopping_listHeaderText}>Shopping List</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.addRow}>
        <TextInput style={styles.addInput}
          placeholder="Add item..."
          placeholderTextColor="#666" value={newName} onChangeText={setNewName} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {items.length === 0 && <Text style={styles.emptyText}>Nothing on the list.</Text>}
          {items.map((item) => {
            const isChecked = checkedIds.has(item.id);
            const isEditing = editingId === item.id;
            return (
              <View key={item.id} style={styles.itemRow}>
                <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkboxWrap}>
                  <View style={[styles.checkboxBox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <View style={styles.itemInfo}>
                  {isEditing ? (
                    <TextInput style={styles.renameInput} value={editingName}
                      onChangeText={setEditingName} onSubmitEditing={saveEdit} onBlur={saveEdit} autoFocus />
                  ) : (
                    <TouchableOpacity onPress={() => { setEditingId(item.id); setEditingName(item.name); }}>
                      <Text style={[styles.itemName, isChecked && styles.itemNameChecked]} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {!isEditing && (
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/add-item', params: { prefillName: item.name, fromShoppingListId: item.id } })}>
                      <Text style={styles.moveText}>Move to tracking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { removeShoppingListItem(item.id); loadData(); }}>
                      <Text style={styles.removeText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/shopping-list")}>
          <Text style={styles.footerText}>Shopping</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/")}>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/analytics")}>
          <Text style={styles.footerText}>Stats</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/settings/setting_index")}>
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

// main screen
  container: {
    flex: 1,
    backgroundColor: "#151B20",
    minHeight: "100%"
  },

// header
  Shopping_listHeader: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: "#1C262E",
    borderBottomWidth: 1,
    borderColor: "#3a3a3a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  Shopping_listHeaderText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#f0f0f0",
  },

  clearAllText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#ff6b6b",
  },

  // add row
  addRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  addInput: {
    flex: 1,
    backgroundColor: "#24323D",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#f0f0f0",
    fontFamily: "Poppins_400Regular",
  },
  addBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  addBtnText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },

  // list
  listContainer: {
    flex: 1,
    backgroundColor: "#1C262E",
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 90,
    borderRadius: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
  emptyText: {
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: "#24323D",
    borderRadius: 12,
  },
  checkboxWrap: { paddingRight: 8 },
  checkboxBox: {
    width: 22, height: 22, borderRadius: 5,
    borderWidth: 2, borderColor: "#555",
    justifyContent: "center", alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#007bff", borderColor: "#007bff" },
  checkmark: { color: "#fff", fontSize: 13, fontFamily: "Poppins_700Bold", lineHeight: 16 },

  itemInfo: { flex: 1, marginRight: 10 },
  itemName: {
    fontSize: 16,
    color: "#d0d0d0",
    fontFamily: "Poppins_400Regular",
  },
  itemNameChecked: { color: "#555", textDecorationLine: "line-through" },
  renameInput: {
    fontSize: 16, color: "#f0f0f0", fontFamily: "Poppins_400Regular",
    backgroundColor: "#24323D", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  itemActions: { flexDirection: "row", gap: 12 },
  moveText: { color: "#007bff", fontFamily: "Poppins_600SemiBold" },
  removeText: { color: "#ff6b6b", fontFamily: "Poppins_700Bold" },

// footer
  footer: {
    position: "absolute",
    bottom: 10,
    left: 14,
    right: 14,
    height: 60,
    backgroundColor: "#1C262E",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  footerItem: {
    flex: 1,
    alignItems: "center",
  },

  footerText: {
    fontSize: 14,
    color: "#f0f0f0",
    fontFamily: "Poppins_600SemiBold",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#32404D",
  },
});
