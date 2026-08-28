import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

const printRoutes = () => ({
    name: "Routes",
    
    configureServer(server: any) {
      server.httpServer?.once("listening", () => {
        const address = server.httpServer?.address();
        
        if (address && typeof address === "object") {
          const port = address.port;
          
          console.log("");
          console.log(`➜ Admin: https://localhost:${port}/admin-login`);
          console.log(`➜ Student: https://localhost:${port}/student-login`);
        }
      })
    
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert(), printRoutes()]
});
