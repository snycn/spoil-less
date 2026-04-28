import { addShoppingListItem, getShoppingList, removeShoppingListItem } from "@/src/repositories/shoppingListRepository";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ShoppingList() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");

  const loadData = useCallback(() => setItems(getShoppingList()), []);
  useFocusEffect(loadData);

  const handleAdd = () => {
      const name = newName.trim();
      if (!name) return;
      const result = addShoppingListItem(name);
      if (result.duplicateExists) Alert.alert('Heads up', `You already have ${name} in active tracking.`);
      setNewName("");
      loadData();
  };

  return (
    <View style={styles.container}>

      <View style={styles.Shopping_listHeader}>
        <Text style={styles.Shopping_listHeaderText}>Shopping List</Text>
      </View>

      <View style={styles.addRow}>
        <TextInput style={styles.addInput}
          placeholder="Add item..." value={newName} onChangeText={setNewName} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {items.length === 0 && <Text style={styles.emptyText}>Nothing on the list.</Text>}
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/add-item', params: { prefillName: item.name } })}>
                <Text style={styles.moveText}>Move to tracking</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { removeShoppingListItem(item.id); loadData(); }}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/shopping-list")}
        >
          <Text style={styles.footerText}>Shopping</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/")}
        >
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/settings/setting_index")}
          >
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
    backgroundColor: "#1a1a1a",
    minHeight: "100%"
  },

// header
  Shopping_listHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#242424",
    borderBottomWidth: 1,
    borderColor: "#3a3a3a",
    alignItems: "center",
  },

  Shopping_listHeaderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f0f0f0",
  },

  // add row
  addRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: "#3a3a3a",
  },
  addInput: {
    flex: 1,
    backgroundColor: "#2e2e2e",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  // list
  listContent: {
    padding: 16,
    paddingBottom: 130,
  },
  emptyText: {
    color: "#999",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#2e2e2e",
  },
  itemName: {
    fontSize: 16,
  },
  itemActions: {
    flexDirection: "row",
    gap: 12,
  },
  moveText: {
    color: "#007bff",
    fontWeight: "600",
  },
  removeText: {
    color: "#ff6b6b",
    fontWeight: "700",
  },

// footer
  footer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    height: 60,
    backgroundColor: "#242424",
    borderTopWidth: 1,
    borderColor: "#3a3a3a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  footerItem: {
    flex: 1,
    alignItems: "center",
  },

  footerText: {
    fontSize: 16,
    color: "#f0f0f0",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#555",
  },
});
