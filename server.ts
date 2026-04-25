import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check for platform diagnostics
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Development server running with Vite middleware");
  } else {
    // Production mode
    const distPath = path.resolve(process.cwd(), "dist");
    
    // Serve static assets
    app.use(express.static(distPath, {
      maxAge: '1y',
      index: ['index.html']
    }));

    // SPA fallback (important for refresh on nested routes)
    app.get("*", (req, res) => {
      // Don't serve index.html for missing /api routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }

      res.sendFile(path.join(distPath, "index.html"), (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Index file not found. Make sure the app is built.");
        }
      });
    });
    console.log(`Production server serving from ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
