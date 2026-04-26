import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddItemScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [expiration, setExpiration] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  return (
    <View style={styles.container}>

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Add Item</Text>

        <View style={{ width: 50 }} />
      </View>

      {/* form */}
      <View style={styles.form}>

        {/* item name */}
        <Text style={styles.label}>Item name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item name..."
          value={name}
          onChangeText={setName}
        />

        {/* expiration date */}
        <Text style={styles.label}>Expiration date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={expiration}
          onChangeText={setExpiration}
        />

        {/* storage location */}
        <Text style={styles.label}>Storage location</Text>
        <TextInput
          style={styles.input}
          placeholder="Select a location..."
          value={location}
          onChangeText={setLocation}
        />

        {/* category */}
        <Text style={styles.label}>Category (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Select a category..."
          value={category}
          onChangeText={setCategory}
        />

        {/* note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter a note..."
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* attach photo */}
        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoText}>Attach photo (optional)</Text>
        </TouchableOpacity>

        {/* save button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save Item</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // header
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

  // form
  form: {
    padding: 20,
  },

  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },

  photoButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },

  photoText: {
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    marginTop: 25,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
