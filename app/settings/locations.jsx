import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addStorageLocation, deleteStorageLocation, getActiveItemCount, getStorageLocations } from "@/src/repositories/storageLocationRepository";

export default function Locations() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [newName, setNewName] = useState("");

  const loadData = useCallback(() => setLocations(getStorageLocations()), []);
  useFocusEffect(loadData);

  const handleAdd = () => {
      const name = newName.trim();
      if (!name) return;
      addStorageLocation(name);
      setNewName("");
      loadData();
  };

  const handleDelete = (loc) => {
      const result = deleteStorageLocation(loc.id);
      if (!result.success) Alert.alert('Cannot delete', `${loc.name} still has ${result.itemCount} item(s).`);
      loadData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Locations</Text>

        {/* spacer to balance layout */}
        <View style={{ width: 50 }} />
      </View>

      <View style={{ flexDirection: "row", padding: 12, gap: 8, borderBottomWidth: 1, borderColor: "#ddd" }}>
        <TextInput style={{ flex: 1, backgroundColor: "#eee", padding: 10, borderRadius: 8, fontSize: 16 }}
          placeholder="New location name..." value={newName} onChangeText={setNewName} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={{ backgroundColor: "#007bff", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" }} onPress={handleAdd}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {locations.length === 0 && <Text style={{ color: "#888" }}>No locations yet.</Text>}
        {locations.map((loc) => (
          <View key={loc.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderColor: "#eee" }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{loc.name}</Text>
              <Text style={{ fontSize: 13, color: "#888" }}>{getActiveItemCount(loc.id)} item(s)</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(loc)}>
              <Text style={{ color: "#b30000", fontWeight: "600" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* container */
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* header */
  header: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backText: {
    fontSize: 16,
    color: "#007bff",
    width: 50,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
});
