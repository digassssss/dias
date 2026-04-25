import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware loaded");
    } catch (e) {
      console.log("Starting in production mode (Vite missing)");
      serveStatic();
    }
  } else {
    serveStatic();
  }

  function serveStatic() {
    const distPath = path.resolve(process.cwd(), "dist");
    
    // Serve static files
    app.use(express.static(distPath));

    // Handle SPA fallback
    app.get("*", (req, res) => {
      // Avoid circular redirects for missing assets
      if (req.path.includes('.') || req.path.startsWith('/api')) {
        return res.status(404).end();
      }

      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html from ${indexPath}:`, err);
          res.status(404).send(`404: Page not found. This is a Single Page Application and the route "${req.path}" failed to resolve to a static file or index.html fallback.`);
        }
      });
    });
    console.log(`Serving static files from ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is LIVE on port ${PORT}`);
    console.log(`Current directory: ${process.cwd()}`);
    console.log(`__dirname: ${__dirname}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch(console.error);
