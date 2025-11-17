// Vercel serverless function handler for all API routes
import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";

// Create Express app instance
const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// Initialize routes (Vercel serverless functions don't need HTTP server)
let routesInitialized = false;
let routesInitPromise: Promise<void> | null = null;

async function initializeRoutes() {
  if (!routesInitPromise) {
    routesInitPromise = (async () => {
      if (!routesInitialized) {
        // registerRoutes returns a Server, but we don't need it for serverless
        // We'll just ignore the return value
        await registerRoutes(app).catch(console.error);
        routesInitialized = true;
      }
    })();
  }
  return routesInitPromise;
}

// Initialize routes on first request
app.use(async (req, res, next) => {
  try {
    await initializeRoutes();
    next();
  } catch (error) {
    console.error("Error initializing routes:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Failed to initialize routes",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Express error handler:", err);
  console.error("Error stack:", err.stack);
  if (!res.headersSent) {
    res.status(status).json({ 
      message,
      error: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  }
});

// Wrap Express app with serverless-http for Vercel compatibility
export default serverless(app);

