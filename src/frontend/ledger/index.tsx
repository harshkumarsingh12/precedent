import React from "react";
import ForgeReconciler, { Text } from "@forge/react";

// Decision ledger global page (spec 0008).
const App = () => <Text>No decisions yet. Record one from any work item, or load the sample workspace.</Text>;

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
