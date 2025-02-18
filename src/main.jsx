import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SWRConfig } from "swr";

createRoot(document.getElementById("root")).render(
  <SWRConfig
    value={{
      refreshInterval: 300000,
    }}
  >
    <App />
  </SWRConfig>
);
