import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Notification Bar */}
      <View style={styles.notificationBar}>
        <Text style={styles.notificationText}>Notification</Text>
        <TouchableOpacity>
          <Text style={styles.viewText}>view </Text>
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

      {/* Section Header: Fridge */}
      <Text style={styles.sectionHeader}>Fridge</Text>
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

        <TouchableOpacity style={styles.footerItem}>
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>

      </View>
        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => console.log("Add pressed")}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
/* Floating Add Button */
floatingBtn: {
  position: "absolute",
  bottom: 80,
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
/* main screen */
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Notification Bar
  notificationBar: {
    backgroundColor: "#ffdddd",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationText: {
    color: "#b30000",
    fontWeight: "600",
  },
  viewText: {
    color: "#b30000",
    fontWeight: "700",
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  filterText: {
    fontSize: 16,
    color: "#444",
  },

  // Section Header
  sectionHeader: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "700",
  },
/* footer */
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#f2f2f2",
    borderTopWidth: 1,
    borderColor: "#ddd",
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
    color: "#333",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
});
