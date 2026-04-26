import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShoppingList() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.Shopping_listHeader}>
        <Text style={styles.Shopping_listHeaderText}>Shopping List</Text>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({

// main screen
  container: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: "100%"
  },

// header 
  Shopping_listHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  Shopping_listHeaderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },

// footer 
  footer: {
    position: "absolute",
    bottom: 50,
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
