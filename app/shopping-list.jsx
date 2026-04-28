import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addShoppingListItem, getShoppingList, removeShoppingListItem } from "@/src/repositories/shoppingListRepository";

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

      <View style={{ flexDirection: "row", padding: 12, gap: 8, borderBottomWidth: 1, borderColor: "#ddd" }}>
        <TextInput style={{ flex: 1, backgroundColor: "#eee", padding: 10, borderRadius: 8, fontSize: 16 }}
          placeholder="Add item..." value={newName} onChangeText={setNewName} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={{ backgroundColor: "#007bff", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" }} onPress={handleAdd}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 130 }}>
        {items.length === 0 && <Text style={{ color: "#888" }}>Nothing on the list.</Text>}
        {items.map((item) => (
          <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/add-item', params: { prefillName: item.name } })}>
                <Text style={{ color: "#007bff", fontWeight: "600" }}>Move to tracking</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { removeShoppingListItem(item.id); loadData(); }}>
                <Text style={{ color: "#b30000", fontWeight: "700" }}>✕</Text>
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
    backgroundColor: "#fff",
    minHeight: "100%"
  },

// header 
  Shopping_listHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  Shopping_listHeaderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },

// footer 
  footer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    height: 60,
    backgroundColor: "#f2f2f2",
    borderTopWidth: 1,
    borderColor: "#ddd",
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
    color: "#333",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
});
