import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>

      {/* header */}
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsHeaderText}>Settings</Text>
      </View>

      {/* settings content */}
      <View style={styles.content}>

        {/* notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Enable notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Days before expiry</Text>
          <Text style={styles.valueBox}>3</Text>
        </View>

        {/* expiring soon */}
        <Text style={styles.sectionTitle}>Expiring Soon Threshold</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Days to show as "soon"</Text>
          <Text style={styles.valueBox}>3</Text>
        </View>

        {/* profile */}
        <Text style={styles.sectionTitle}>Profile</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Current profile</Text>
          <Text style={styles.valueBox}>My Kitchen</Text>
        </View>

        <TouchableOpacity style={styles.button}
        onPress={() => router.push("/settings/profiles")}
        >
          <Text style={styles.buttonText}>Manage Profiles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => router.push("/settings/locations")}>
          <Text style={styles.buttonText}>Manage Storage Locations</Text>
        </TouchableOpacity>

      </View>

      {/* footer */}
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

  // main container
  container: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: "100%",
  },

  // header
  settingsHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  settingsHeaderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },

  // content
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
  },

  valueBox: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
  },

  button: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
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
