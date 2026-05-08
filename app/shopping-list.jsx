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
          placeholder="Add item..."
          placeholderTextColor="#666" value={newName} onChangeText={setNewName} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {items.length === 0 && <Text style={styles.emptyText}>Nothing on the list.</Text>}
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
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
      </View>

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
    backgroundColor: "#151B20",
    minHeight: "100%"
  },

// header
  Shopping_listHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#1C262E",
    borderBottomWidth: 1,
    borderColor: "#3a3a3a",
    alignItems: "center",
  },

  Shopping_listHeaderText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#f0f0f0",
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
    overflow: "hidden",
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
  itemName: {
    flex: 1,
    fontSize: 16,
    color: "#d0d0d0",
    fontFamily: "Poppins_400Regular",
    marginRight: 12,
  },
  itemActions: {
    flexDirection: "row",
    gap: 12,
  },
  moveText: {
    color: "#007bff",
    fontFamily: "Poppins_600SemiBold",
  },
  removeText: {
    color: "#ff6b6b",
    fontFamily: "Poppins_700Bold",
  },

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
    fontSize: 16,
    color: "#f0f0f0",
    fontFamily: "Poppins_600SemiBold",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#32404D",
  },
});
