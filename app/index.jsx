import { db } from "@/src/database/DatabaseManager";
import { getActiveFoodItems, getExpiringSoonItems } from "@/src/repositories/foodItemRepository";
import { getStorageLocations } from "@/src/repositories/storageLocationRepository";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedLocations, setExpandedLocations] = useState(new Set());

  const toggleLocation = (locId) => {
    setExpandedLocations(prev => {
      const next = new Set(prev);
      next.has(locId) ? next.delete(locId) : next.add(locId);
      return next;
    });
  };

  useFocusEffect(useCallback(() => {
      setItems(getActiveFoodItems());
      setLocations(getStorageLocations());
      const prefs = db.getFirstSync('SELECT expiryThreshold FROM notification_preferences WHERE id = 1');
      setExpiringSoonCount(getExpiringSoonItems(prefs?.expiryThreshold ?? 3).length);
  }, []));

  return (
    <View style={styles.container}>
      {/* Top Notification Bar */}
      <View style={styles.notificationBar}>
        <Text style={styles.notificationText}>
          {expiringSoonCount > 0 ? `${expiringSoonCount} item(s) expiring soon` : 'No items expiring soon'}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewText}
          onPress={() => router.push("/expiring-soon")}>view </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.filterRow}>
        {['All', 'Produce', 'Dairy', 'Protein', 'Grains', 'Other'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items grouped by storage location */}
      <ScrollView style={styles.itemList} contentContainerStyle={styles.itemListContent}>
        {items.length === 0 && <Text style={styles.emptyText}>No items yet. Tap + to add one.</Text>}
        {locations.map((loc) => {
          let locItems = items.filter(i => i.storageLocationId === loc.id);
          if (activeFilter !== 'All') {
            locItems = locItems.filter(i => i.categoryId === activeFilter);
          }
          if (locItems.length === 0) return null;

          const color = CARD_COLORS[loc.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % CARD_COLORS.length];
          const isExpanded = expandedLocations.has(loc.id);

          return (
            <View key={loc.id} style={[styles.locationCard, { backgroundColor: color }]}>

              {/* Card header — tap to expand/collapse */}
              <TouchableOpacity style={styles.cardHeader} onPress={() => toggleLocation(loc.id)}>
                <View>
                  <Text style={styles.cardTitle}>{loc.name}</Text>
                  <Text style={styles.cardSubtitle}>{locItems.length} item{locItems.length !== 1 ? 's' : ''}</Text>
                </View>
                <Text style={styles.cardChevron}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* All items when expanded */}
              {isExpanded && locItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.cardItem}
                  onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}
                >
                  <Text style={styles.cardItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardItemExpiry}>{item.expirationDate}</Text>
                </TouchableOpacity>
              ))}

              <View style={{ height: 8 }} />
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/shopping-list")}
        >
          <Text style={styles.footerText}>Shopping</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/")}
        >
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/settings/setting_index")}
          >
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>

      </View>
        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => router.push("/add-item")}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    </View>
  );
}

const CARD_COLORS = ['#1877F2', '#E8762D', '#27AE60', '#E74C3C', '#8E44AD', '#16A085', '#F39C12', '#E91E63'];

const styles = StyleSheet.create({

//main screen
  container: {
    flex: 1,
    backgroundColor: "#151B20",
    minHeight: "100%"
  },

  // Notification Bar
  notificationBar: {
    backgroundColor: "#351A20",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationText: {
    color: "#ff6b6b",
    fontFamily: "Poppins_600SemiBold",
  },
  viewText: {
    color: "#ff6b6b",
    fontFamily: "Poppins_700Bold",
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginHorizontal: 14,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#1C262E",
    gap: 3,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "#007bff",
  },
  filterText: {
    fontSize: 12,
    color: "#bbb",
    fontFamily: "Poppins_400Regular",
  },
  filterTextActive: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },

  // Item list
  itemList: {
    flex: 1,
  },
  itemListContent: {
    paddingBottom: 130,
    paddingTop: 4,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
    fontFamily: "Poppins_400Regular",
  },

  // Location cards
  locationCard: {
    marginHorizontal: 14,
    marginTop: 18,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },
  cardChevron: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 10,
    marginBottom: 6,
    borderRadius: 10,
  },
  cardItemName: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    marginRight: 8,
  },
  cardItemExpiry: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.75)",
  },

// Floating Add Button
floatingBtn: {
  position: "absolute",
  bottom: 130,
  right: 25,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#007bff",
  justifyContent: "center",
  alignItems: "center",
  elevation: 6,
},
plus: {
  color: "white",
  fontSize: 32,
  marginTop: -2,
},

// footer
  footer: {
    position: "absolute",
    bottom: 50,
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
    fontSize: 16,
    color: "#f0f0f0",
    fontFamily: "Poppins_600SemiBold",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#555",
  },
});
