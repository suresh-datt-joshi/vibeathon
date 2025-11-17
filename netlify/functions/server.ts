import serverless from "serverless-http";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../../server/routes";

// Create Express app instance
const app = express();

// Middleware
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

// Initialize routes and static serving
let cachedHandler: ReturnType<typeof serverless> | null = null;

async function initializeApp() {
  if (cachedHandler) return cachedHandler;

  // Register API routes (this returns a Server but we don't need it for Netlify)
  await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error("Error:", err);
  });

  // Note: Static files are served directly by Netlify, not through this function
  // This function only handles API routes

  // Wrap Express app with serverless-http
  cachedHandler = serverless(app, {
    binary: ['image/*', 'font/*', 'application/octet-stream'],
  });

  return cachedHandler;
}

// Export the handler function
export const handler = async (event: any, context: any) => {
  const appHandler = await initializeApp();
  return appHandler(event, context);
};

