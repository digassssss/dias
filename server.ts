import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`[Server] Starting SMK Prima Unggul CBT Server...`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);

  // Logger
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[Request] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // Simple health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Configuring Vite middleware for development...");
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          allowedHosts: true
        },
        appType: "spa",
      });
      console.log("[Server] Vite server created successfully");
      app.use(vite.middlewares);
      console.log("[Server] Vite middlewares attached");
    } catch (viteError) {
      console.error("[Server] Failed to initialize Vite:", viteError);
      throw viteError;
    }
  } else {
    console.log("[Server] Configuring static file serving for production");
    const distPath = path.resolve(__dirname, "dist");
    
    if (!fs.existsSync(distPath)) {
      console.warn(`[Server] WARNING: dist directory not found at ${distPath}. Build might be missing.`);
    }

    app.use(express.static(distPath));
    
    // Always serve index.html for SPA routes
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application build not found. Please run 'npm run build'.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] Critical failure during startup:", err);
  process.exit(1);
});
