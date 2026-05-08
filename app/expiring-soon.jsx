import { getExpiringSoonItems } from "@/src/repositories/foodItemRepository";
import { getStorageLocations } from "@/src/repositories/storageLocationRepository";
import { getDaysUntilExpiration } from "@/src/services/expirationService";
import { db } from "@/src/database/DatabaseManager";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// container + header with back
export default function ExpiringSoon() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);

  useFocusEffect(useCallback(() => {
    const prefs = db.getFirstSync('SELECT expiryThreshold FROM notification_preferences WHERE id = 1');
    setItems(getExpiringSoonItems(prefs?.expiryThreshold ?? 3));
    setLocations(getStorageLocations());
  }, []));

  const locationName = (id) => locations.find(l => l.id === id)?.name ?? '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Expiring Soon</Text>

        {/* spacer to balance layout */}
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {items.length === 0 && <Text style={styles.emptyText}>Nothing expiring soon.</Text>}
        {items.map((item) => {
          const days = getDaysUntilExpiration(item.expirationDate);
          const label = days < 0 ? 'Expired' : days === 0 ? 'Today' : `${days}d`;
          return (
            <TouchableOpacity key={item.id} onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}
              style={styles.itemRow}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemLocation}>{locationName(item.storageLocationId)}</Text>
              </View>
              <Text style={styles.itemLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
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

  // list
  listContent: {
    padding: 16,
  },
  emptyText: {
    color: "#999",
    marginTop: 20,
    fontFamily: "Poppins_400Regular",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2D3848",
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    color: "#f0f0f0",
    fontFamily: "Poppins_400Regular",
  },
  itemLocation: {
    fontSize: 13,
    color: "#888",
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
  itemLabel: {
    color: "#ff6b6b",
    fontFamily: "Poppins_600SemiBold",
  },
});
