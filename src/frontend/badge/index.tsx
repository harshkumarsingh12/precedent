import React from "react";
import ForgeReconciler, { Text } from "@forge/react";

// Issue context badge: Clear / N conflicts / N to confirm / Checking (spec 0008).
const App = () => <Text>Clear</Text>;

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
