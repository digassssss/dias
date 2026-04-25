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
    
    console.log(`Setting up static server for: ${distPath}`);
    if (!fs.existsSync(distPath)) {
      console.warn(`WARNING: dist directory not found at ${distPath}`);
    }

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      // API routes should not fall back to index.html
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not Found' });
      }

      // If the path looks like a file (has an extension), return 404 instead of index.html
      const ext = path.extname(req.path);
      if (ext && ext.length > 1) {
          return res.status(404).send('File not found');
      }

      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html:`, err);
          res.status(404).send(`Application Error: Build artifacts missing.`);
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is LIVE on port ${PORT}`);
    console.log(`Current directory: ${process.cwd()}`);
    console.log(`__dirname: ${__dirname}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch(console.error);
