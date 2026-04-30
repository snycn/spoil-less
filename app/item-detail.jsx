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

          {/* Summary card */}
          {(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const exp = new Date(item.expirationDate);
            const daysLeft = Math.round((exp - today) / (1000 * 60 * 60 * 24));
            const badgeLabel = daysLeft < 0 ? `${Math.abs(daysLeft)}d expired` : daysLeft === 0 ? "Today" : `${daysLeft}d`;
            const badgeColor = daysLeft < 0 ? "#b30000" : daysLeft <= 3 ? "#c0392b" : "#2e6b3e";
            const addedDate = item.createdAt ? item.createdAt.split('T')[0] : null;
            return (
              <View style={styles.summaryCard}>
                <View style={styles.summaryCardTop}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>{badgeLabel}</Text>
                  </View>
                </View>
                <Text style={styles.summaryField}>Expires: {item.expirationDate}</Text>
                {addedDate ? <Text style={styles.summaryField}>Added: {addedDate}</Text> : null}
              </View>
            );
          })()}

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
    backgroundColor: "#151B20",
  },

  /* header */
  header: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#1C262E",
    borderBottomWidth: 1,
    borderColor: "#253040",
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

  notFound: { padding: 20, color: "#999", fontFamily: "Poppins_400Regular" },
  content: { padding: 20 },

  summaryCard: {
    backgroundColor: "#19283D",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  summaryCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
  },
  summaryField: {
    fontSize: 15,
    color: "#ccddf0",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },

  itemName: { fontSize: 22, fontFamily: "Poppins_700Bold", color: "#f0f0f0", flexShrink: 1, marginRight: 10 },
  field: { fontSize: 16, marginBottom: 8, color: "#f0f0f0", fontFamily: "Poppins_400Regular" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 24 },
  btnUsed:    { flex: 1, backgroundColor: "#28a745", padding: 14, borderRadius: 10, alignItems: "center" },
  btnDiscard: { flex: 1, backgroundColor: "#fd7e14", padding: 14, borderRadius: 10, alignItems: "center" },
  btnDelete:  { marginTop: 12, backgroundColor: "#b30000", padding: 14, borderRadius: 10, alignItems: "center" },
  btnText:    { color: "#fff", fontFamily: "Poppins_700Bold" },
});
