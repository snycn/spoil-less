import { db } from "@/src/database/DatabaseManager";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Analytics() {
  const router = useRouter();
  const [usedCount, setUsedCount] = useState(0);
  const [discardedCount, setDiscardedCount] = useState(0);
  const [topDiscarded, setTopDiscarded] = useState([]);
  const [topUsed, setTopUsed] = useState([]);

  useFocusEffect(useCallback(() => {
    const counts = db.getFirstSync(`
      SELECT
        SUM(CASE WHEN status = 'used' THEN 1 ELSE 0 END) as usedCount,
        SUM(CASE WHEN status = 'discarded' THEN 1 ELSE 0 END) as discardedCount
      FROM food_items
      WHERE status IN ('used', 'discarded')
    `);
    setUsedCount(counts?.usedCount ?? 0);
    setDiscardedCount(counts?.discardedCount ?? 0);

    setTopDiscarded(db.getAllSync(`
      SELECT name, COUNT(*) as count
      FROM food_items WHERE status = 'discarded'
      GROUP BY name ORDER BY count DESC LIMIT 5
    `));

    setTopUsed(db.getAllSync(`
      SELECT name, COUNT(*) as count
      FROM food_items WHERE status = 'used'
      GROUP BY name ORDER BY count DESC LIMIT 5
    `));
  }, []));

  const total = usedCount + discardedCount;
  const spoilageRate = total > 0 ? Math.round((discardedCount / total) * 100) : 0;

  const handleReset = () => {
    Alert.alert(
      'Reset Analytics',
      'This will permanently delete all used and discarded item history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive', onPress: () => {
            db.runSync("DELETE FROM food_items WHERE status IN ('used', 'discarded')");
            setUsedCount(0);
            setDiscardedCount(0);
            setTopDiscarded([]);
            setTopUsed([]);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: "#27AE60" }]}>
            <Text style={styles.summaryValue}>{usedCount}</Text>
            <Text style={styles.summaryLabel}>Used</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#E74C3C" }]}>
            <Text style={styles.summaryValue}>{discardedCount}</Text>
            <Text style={styles.summaryLabel}>Discarded</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#E8762D" }]}>
            <Text style={styles.summaryValue}>{spoilageRate}%</Text>
            <Text style={styles.summaryLabel}>Spoilage</Text>
          </View>
        </View>

        {/* Most discarded */}
        <Text style={styles.sectionTitle}>Most Discarded</Text>
        {topDiscarded.length === 0
          ? <Text style={styles.emptyText}>No discarded items yet.</Text>
          : topDiscarded.map((item, i) => (
            <View key={i} style={styles.rankRow}>
              <Text style={styles.rankIndex}>{i + 1}</Text>
              <Text style={styles.rankName}>{item.name}</Text>
              <Text style={styles.rankCount}>{item.count}×</Text>
            </View>
          ))
        }

        {/* Most used */}
        <Text style={styles.sectionTitle}>Most Used</Text>
        {topUsed.length === 0
          ? <Text style={styles.emptyText}>No used items yet.</Text>
          : topUsed.map((item, i) => (
            <View key={i} style={styles.rankRow}>
              <Text style={styles.rankIndex}>{i + 1}</Text>
              <Text style={styles.rankName}>{item.name}</Text>
              <Text style={styles.rankCount}>{item.count}×</Text>
            </View>
          ))
        }

        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>Reset Analytics</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/shopping-list")}>
          <Text style={styles.footerText}>Shopping</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/")}>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/analytics")}>
          <Text style={[styles.footerText, styles.footerActive]}>Stats</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push("/settings/setting_index")}>
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151B20",
  },

  header: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#1C262E",
    borderBottomWidth: 1,
    borderColor: "#2D3848",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#f0f0f0",
  },

  content: {
    padding: 16,
    paddingBottom: 90,
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#f0f0f0",
    marginTop: 24,
    marginBottom: 10,
  },
  emptyText: {
    color: "#666",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C262E",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 7,
  },
  rankIndex: {
    width: 24,
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
    color: "#555",
  },
  rankName: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#f0f0f0",
  },
  rankCount: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#888",
  },

  // Reset
  resetBtn: {
    marginTop: 30,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#2D1A1A",
    alignItems: "center",
  },
  resetText: {
    color: "#ff6b6b",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 10,
    left: 14,
    right: 14,
    height: 60,
    backgroundColor: "#1C262E",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  footerItem: {
    flex: 1,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#f0f0f0",
    fontFamily: "Poppins_600SemiBold",
  },
  footerActive: {
    color: "#007bff",
  },
  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#32404D",
  },
});
