import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	rootElement.style.width = "100%";
	rootElement.style.height = "100%";
	rootElement.style.display = "flex";
	rootElement.style.margin = "10px";

	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
