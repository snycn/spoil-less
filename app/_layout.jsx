import { Stack } from "expo-router";
import { initializeDatabase } from "@/src/database/DatabaseManager";

initializeDatabase();

export default function RootLayout() {
  return <Stack />;
}
