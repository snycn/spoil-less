import { deleteFoodItem, getFoodItemById, markAsDiscarded, markAsUsed } from "@/src/repositories/foodItemRepository";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

      {!item ? <Text style={styles.notFound}>Item not found.</Text> : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.field}>Expires: {item.expirationDate}</Text>
          {item.note ? <Text style={styles.field}>Note: {item.note}</Text> : null}

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleUsed}    style={styles.btnUsed}><Text style={styles.btnText}>Mark as used</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleDiscard} style={styles.btnDiscard}><Text style={styles.btnText}>Discard</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.btnDelete}>
            <Text style={styles.btnText}>Delete item</Text>
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
    backgroundColor: "#1a1a1a",
  },

  /* header */
  header: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#242424",
    borderBottomWidth: 1,
    borderColor: "#3a3a3a",
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
    color: "#f0f0f0",
  },

  notFound: { padding: 20, color: "#999" },
  content: { padding: 20 },
  itemName: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#f0f0f0" },
  field: { fontSize: 16, marginBottom: 8, color: "#f0f0f0" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 24 },
  btnUsed:    { flex: 1, backgroundColor: "#28a745", padding: 14, borderRadius: 10, alignItems: "center" },
  btnDiscard: { flex: 1, backgroundColor: "#fd7e14", padding: 14, borderRadius: 10, alignItems: "center" },
  btnDelete:  { marginTop: 12, backgroundColor: "#b30000", padding: 14, borderRadius: 10, alignItems: "center" },
  btnText:    { color: "#fff", fontWeight: "700" },
});
