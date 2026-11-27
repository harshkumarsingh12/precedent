import React from "react";
import ForgeReconciler, { Text } from "@forge/react";

// Issue panel: conflict cards, decisions in scope, proposals to confirm, Record decision (spec 0008).
const App = () => <Text>Precedent: no decisions apply to this work item yet.</Text>;

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
