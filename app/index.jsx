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

  useFocusEffect(useCallback(() => {
      setItems(getActiveFoodItems());
      setLocations(getStorageLocations());
      setExpiringSoonCount(getExpiringSoonItems(7).length);
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
        <TouchableOpacity><Text style={styles.filterText}>All</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>Dairy</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>Produce</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>Meat</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>date</Text></TouchableOpacity>
      </View>

      {/* Items grouped by storage location */}
      <ScrollView style={styles.itemList} contentContainerStyle={styles.itemListContent}>
        {items.length === 0 && <Text style={styles.emptyText}>No items yet. Tap + to add one.</Text>}
        {locations.map((loc) => {
          const locItems = items.filter(i => i.storageLocationId === loc.id);
          if (locItems.length === 0) return null;
          return (
            <View key={loc.id}>
              <Text style={styles.sectionHeader}>{loc.name}</Text>
              {locItems.map((item) => (
                <TouchableOpacity key={item.id}
                  style={styles.itemRow}
                  onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemExpiry}>{item.expirationDate}</Text>
                </TouchableOpacity>
              ))}
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

const styles = StyleSheet.create({

//main screen
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    minHeight: "100%"
  },

  // Notification Bar
  notificationBar: {
    backgroundColor: "#3d0000",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationText: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  viewText: {
    color: "#ff6b6b",
    fontWeight: "700",
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#3a3a3a",
  },
  filterText: {
    fontSize: 16,
    color: "#bbb",
  },

  // Section Header
  sectionHeader: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "700",
    color: "#d0d0d0",
  },

  // Item list
  itemList: {
    flex: 1,
  },
  itemListContent: {
    paddingBottom: 130,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#2e2e2e",
  },
  itemName: {
    fontSize: 16,
    color: "#f0f0f0",
  },
  itemExpiry: {
    fontSize: 14,
    color: "#999",
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
    width: "100%",
    height: 60,
    backgroundColor: "#242424",
    borderTopWidth: 1,
    borderColor: "#3a3a3a",
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
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#555",
  },
});
