import { getExpiringSoonItems } from "@/src/repositories/foodItemRepository";
import { getDaysUntilExpiration } from "@/src/services/expirationService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// container + header with back
export default function ExpiringSoon() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useFocusEffect(useCallback(() => { setItems(getExpiringSoonItems(7)); }, []));

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
              <Text style={styles.itemName}>{item.name}</Text>
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

  spacer: {
    width: 50,
  },

  // list
  listContent: {
    padding: 16,
  },
  emptyText: {
    color: "#888",
    marginTop: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
  },
  itemLabel: {
    color: "#b30000",
    fontWeight: "600",
  },
});
