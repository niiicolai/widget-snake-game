import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/widget-snake-game",
  plugins: [tailwindcss(), react()],
});
