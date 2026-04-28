import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addFoodItem } from "@/src/repositories/foodItemRepository";
import { getStorageLocations } from "@/src/repositories/storageLocationRepository";

function formatDateInput(text) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function isValidDate(str) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(d);
}

export default function AddItemScreen() {
  const router = useRouter();
  const { prefillName } = useLocalSearchParams();

  const [name, setName] = useState(prefillName ?? "");
  const [expiration, setExpiration] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [locations, setLocations] = useState([]);

  useFocusEffect(useCallback(() => {
      setLocations(getStorageLocations());
  }, []));

  const handleSave = () => {
      if (!name.trim()) {
          Alert.alert('Missing info', 'Item name is required.');
          return;
      }
      if (!selectedLocationId) {
          Alert.alert('Missing info', 'Please select a storage location.');
          return;
      }
      if (expiration && !isValidDate(expiration)) {
          Alert.alert('Invalid date', 'Enter a complete date in YYYY-MM-DD format.');
          return;
      }
      addFoodItem({
          name: name.trim(),
          expirationDate: expiration || undefined,
          storageLocationId: selectedLocationId,
          note: note.trim() || null,
      });
      router.back();
  };

  return (
    <View style={styles.container}>

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Add Item</Text>

        <View style={{ width: 50 }} />
      </View>

      {/* form */}
      <ScrollView style={styles.form}>

        {/* item name */}
        <Text style={styles.label}>Item name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item name..."
          value={name}
          onChangeText={setName}
        />

        {/* expiration date */}
        <Text style={styles.label}>Expiration date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (optional — leave blank for default)"
          value={expiration}
          onChangeText={(text) => setExpiration(formatDateInput(text))}
          keyboardType="numeric"
          maxLength={10}
        />

        {/* storage location */}
        <Text style={styles.label}>Storage location</Text>
        {locations.length === 0 ? (
            <Text style={styles.hint}>No locations yet. Add one in Settings → Manage Storage Locations.</Text>
        ) : (
            locations.map((loc) => (
                <TouchableOpacity
                    key={loc.id}
                    style={[styles.input, styles.locationOption, selectedLocationId === loc.id && styles.locationSelected]}
                    onPress={() => setSelectedLocationId(loc.id)}
                >
                    <Text style={selectedLocationId === loc.id ? styles.locationSelectedText : {}}>
                        {selectedLocationId === loc.id ? '✓  ' : ''}{loc.name}
                    </Text>
                </TouchableOpacity>
            ))
        )}

        {/* category */}
        <Text style={styles.label}>Category (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Select a category..."
          value={category}
          onChangeText={setCategory}
        />

        {/* note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter a note..."
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* attach photo */}
        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoText}>Attach photo (optional)</Text>
        </TouchableOpacity>

        {/* save button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Item</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // header
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

  // form
  form: {
    padding: 20,
  },

  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },

  hint: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 4,
  },

  locationOption: {
    marginBottom: 6,
  },

  locationSelected: {
    backgroundColor: "#007bff",
  },

  locationSelectedText: {
    color: "#fff",
    fontWeight: "600",
  },

  photoButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },

  photoText: {
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    marginTop: 25,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
