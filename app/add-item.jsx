import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addFoodItem } from "@/src/repositories/foodItemRepository";
import { getStorageLocations } from "@/src/repositories/storageLocationRepository";
import { foodkeeperItems } from "@/src/utils/foodkeeperUtils";

function expiryDateFromDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

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

  const filteredItems = useMemo(() => {
      const q = name.trim().toLowerCase();
      if (!q) return foodkeeperItems;
      return foodkeeperItems.filter(
          item =>
              item.name.toLowerCase().includes(q) ||
              (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
              item.keywords.toLowerCase().includes(q)
      );
  }, [name]);

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

        {/* item name / search */}
        <Text style={styles.label}>Item name</Text>
        <TextInput
          style={styles.input}
          placeholder="Type or search for an item..."
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          clearButtonMode="while-editing"
        />
        <FlatList
          style={styles.quickList}
          data={filteredItems}
          keyExtractor={item => item.id.toString()}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickItem}
              onPress={() => {
                setName(item.name);
                setExpiration(expiryDateFromDays(item.defaultDays));
              }}
            >
              <View style={styles.quickItemInfo}>
                <Text style={styles.quickItemName}>{item.name}</Text>
                {item.subtitle ? (
                  <Text style={styles.quickItemSubtitle}>{item.subtitle}</Text>
                ) : null}
              </View>
              <Text style={styles.quickItemDays}>{item.defaultDays}d</Text>
            </TouchableOpacity>
          )}
        />

        {/* expiration date */}
        <Text style={styles.label}>Expiration date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (optional)"
          placeholderTextColor="#666"
          value={expiration}
          onChangeText={(text) => setExpiration(formatDateInput(text))}
          keyboardType="numeric"
          maxLength={10}
        />

        {/* storage location */}
        <Text style={styles.label}>Storage location</Text>
        {locations.length === 0 && <Text style={styles.hint}>No locations yet.</Text>}
        {locations.map((loc) => (
            <TouchableOpacity
                key={loc.id}
                style={[styles.input, styles.locationOption, selectedLocationId === loc.id && styles.locationSelected]}
                onPress={() => setSelectedLocationId(loc.id)}
            >
                <Text style={selectedLocationId === loc.id ? styles.locationSelectedText : styles.locationText}>
                    {selectedLocationId === loc.id ? '✓  ' : ''}{loc.name}
                </Text>
            </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.goToSettingsBtn} onPress={() => router.push("/settings/locations")}>
            <Text style={styles.goToSettingsText}>Manage Storage Locations</Text>
        </TouchableOpacity>

        {/* category */}
        <Text style={styles.label}>Category (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Select a category..."
          placeholderTextColor="#666"
          value={category}
          onChangeText={setCategory}
        />

        {/* note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter a note..."
          placeholderTextColor="#666"
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
    backgroundColor: "#151B20",
  },

  // header
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

  // form
  form: {
    padding: 20,
  },

  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: "#f0f0f0",
    fontFamily: "Poppins_600SemiBold",
  },

  quickList: {
    height: 200,
    backgroundColor: "#1C2A35",
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 4,
  },
  quickItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#253040",
  },
  quickItemInfo: {
    flex: 1,
    marginRight: 8,
  },
  quickItemName: {
    color: "#f0f0f0",
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  quickItemSubtitle: {
    color: "#888",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  quickItemDays: {
    color: "#999",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },

  hint: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },

  noLocationsBox: {
    gap: 8,
    marginBottom: 8,
  },

  goToSettingsBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#24323D",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  goToSettingsText: {
    color: "#007bff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    backgroundColor: "#24323D",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 4,
    color: "#f0f0f0",
    fontFamily: "Poppins_400Regular",
  },

  locationOption: {
    marginBottom: 6,
  },

  locationSelected: {
    backgroundColor: "#007bff",
  },

  locationText: {
    color: "#f0f0f0",
    fontFamily: "Poppins_400Regular",
  },

  locationSelectedText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },

  photoButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#2D3848",
    borderRadius: 10,
    alignItems: "center",
  },

  photoText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#f0f0f0",
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
    fontFamily: "Poppins_700Bold",
  },
});
