import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-datatable/styles.layer.css";
import "./index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <MantineProvider defaultColorScheme="dark">
    <Notifications position="top-right" zIndex={1000} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>,
);
