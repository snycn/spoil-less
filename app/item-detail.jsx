import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteFoodItem, getFoodItemById, markAsDiscarded, markAsUsed } from "@/src/repositories/foodItemRepository";

export default function ItemDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const item = getFoodItemById(id);

  const handleUsed    = () => { markAsUsed(id); router.back(); };
  const handleDiscard = () => { markAsDiscarded(id); router.back(); };
  const handleDelete  = () => Alert.alert('Delete', `Remove ${item?.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteFoodItem(id); router.back(); } },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Item Detail</Text>

        {/* spacer */}
        <View style={{ width: 50 }} />
      </View>

      {!item ? <Text style={{ padding: 20, color: "#888" }}>Item not found.</Text> : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>{item.name}</Text>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Expires: {item.expirationDate}</Text>
          {item.note ? <Text style={{ fontSize: 16, marginBottom: 8 }}>Note: {item.note}</Text> : null}

          <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
            <TouchableOpacity onPress={handleUsed}    style={{ flex: 1, backgroundColor: "#28a745", padding: 14, borderRadius: 10, alignItems: "center" }}><Text style={{ color: "#fff", fontWeight: "700" }}>Mark as used</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleDiscard} style={{ flex: 1, backgroundColor: "#fd7e14", padding: 14, borderRadius: 10, alignItems: "center" }}><Text style={{ color: "#fff", fontWeight: "700" }}>Discard</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleDelete} style={{ marginTop: 12, backgroundColor: "#b30000", padding: 14, borderRadius: 10, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Delete item</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
