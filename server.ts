import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

console.log("Starting server script...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Initializing express application...");
  const app = express();
  const PORT = 3000;

  console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}`);

  // Test route
  app.get("/api/test-server", (req, res) => {
    res.send("Express server is responding correctly!");
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      time: new Date().toISOString()
    });
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Running in development mode...");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite dev middleware attached");
    } catch (e) {
      console.error("Vite dev middleware failed:", e);
      serveStatic();
    }
  } else {
    console.log("Running in production mode...");
    serveStatic();
  }

  function serveStatic() {
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`Checking for build artifacts at: ${distPath}`);
    
    if (!fs.existsSync(distPath)) {
      console.error(`CRITICAL ERROR: Build artifacts missing at ${distPath}`);
      console.log("Current working directory:", process.cwd());
      console.log("Directory contents:", fs.readdirSync(process.cwd()));
    } else {
      console.log("Build artifacts found. Listing dist contents:", fs.readdirSync(distPath));
    }

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      // Filter out file requests that aren't found
      if (req.path.includes('.')) {
        return res.status(404).end();
      }

      const indexPath = path.join(distPath, "index.html");
      if (!fs.existsSync(indexPath)) {
        console.error(`Fallback failure: index.html not found at ${indexPath}`);
        return res.status(500).send("Application shell missing. Please trigger a rebuild.");
      }

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Failed to send index.html: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).send("Error serving application.");
          }
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> SERVER READY: http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
