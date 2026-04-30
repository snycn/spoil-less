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
        <View style={styles.spacer} />
      </View>

      <View style={styles.addRow}>
        <TextInput style={styles.addInput}
          placeholder="New location name..."
          placeholderTextColor="#666" value={newName} onChangeText={setNewName} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {locations.length === 0 && <Text style={styles.emptyText}>No locations yet.</Text>}
        {locations.map((loc) => (
          <View key={loc.id} style={styles.locRow}>
            <View>
              <Text style={styles.locName}>{loc.name}</Text>
              <Text style={styles.locCount}>{getActiveItemCount(loc.id)} item(s)</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(loc)}>
              <Text style={styles.deleteText}>Delete</Text>
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
    backgroundColor: "#151B20",
  },

  /* header */
  header: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#1C262E",
    borderBottomWidth: 1,
    borderColor: "#2D3848",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backText: {
    fontSize: 16,
    color: "#007bff",
    width: 50,
    fontFamily: "Poppins_400Regular",
  },

  headerText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#f0f0f0",
  },

  spacer: {
    width: 50,
  },

  // add row
  addRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: "#2D3848",
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
  listContent: {
    padding: 16,
  },
  emptyText: {
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
  locRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#24323D",
  },
  locName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#d0d0d0",
  },
  locCount: {
    fontSize: 13,
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
  deleteText: {
    color: "#ff6b6b",
    fontFamily: "Poppins_600SemiBold",
  },
});
