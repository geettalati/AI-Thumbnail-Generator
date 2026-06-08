// =======================
// IMPORTS
// =======================

// Express is a minimal Node.js framework used to build APIs & servers
// Interview Q (Theory):
// 1) Why do we use Express instead of pure Node.js HTTP module?
// 2) What problems does Express solve?
// 3) What does express() internally return?
import express, { Request, Response } from 'express';

// CORS allows frontend & backend (different origins) to communicate
// Interview Q:
// 4) What is CORS?
// 5) What happens if CORS is not configured properly?
// 6) Difference between simple request & preflight request?

import cors from 'cors';

// Loads environment variables from .env into process.env
// Interview Q:
// 7) Why should secrets never be hardcoded?
// 8) What happens if dotenv is not used?
import 'dotenv/config';

// Custom MongoDB connection logic (usually mongoose.connect)
// Interview Q:
// 9) Why should DB connection be established before server starts?
// 10) What happens if DB connection fails after server starts?
import connectDB from './configs/db.js';

// express-session enables server-side session management
// Interview Q:
// 11) What is session-based authentication?
// 12) Difference between session-based auth and JWT auth?
import session from 'express-session';

// Stores session data in MongoDB instead of memory
// Interview Q:
// 13) Why is MemoryStore unsafe in production?
// 14) What happens if server restarts and sessions are in memory?
import MongoStore from 'connect-mongo';
import authrouter from './routes/auth.routes.js';
import thumbnailrouter from './routes/thumbnail.routes.js';
import userrouter from './routes/user.routes.js';

// =======================
// TYPESCRIPT SESSION EXTENSION
// =======================

// This is TypeScript declaration merging
// We are extending express-session's SessionData interface
// Interview Q:
// 15) What is declaration merging in TypeScript?
// 16) Why does req.session.userId give error without this?
declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: boolean;
    userId?: string;
  }
}


// =======================
// APP INITIALIZATION
// =======================

// Creates an Express application instance
// Interview Q:
// 17) What does this app object contain internally?
// 18) Is Express single-threaded or multi-threaded?
const app = express();


// =======================
// CORS CONFIGURATION
// =======================

// This middleware runs for EVERY request
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://thumblifyago-kohl.vercel.app',
].filter(Boolean) as string[];

app.use(
  cors({
    // Allowed frontend URLs
    // Interview Q:
    // 19) Why must frontend URL be explicitly mentioned?
    // 20) What happens if origin is "*"" and credentials is true?
    origin: allowedOrigins,

    // Allows cookies/session IDs to be sent from frontend
    // Interview Q:
    // 21) Why is credentials:true REQUIRED for sessions?
    // 22) What breaks if this is false?
    credentials: true,
  })
);


// =======================
// BODY PARSER
// =======================

// Parses incoming JSON request body and attaches it to req.body
// Interview Q:
// 23) What happens if express.json() is removed?
// 24) Difference between express.json() and body-parser?
app.use(express.json());


// =======================
// SESSION CONFIGURATION
// =======================

app.use(
  session({
    // Secret key used to sign session ID cookie
    // Interview Q:
    // 25) What happens if session secret is leaked?
    // 26) Should secret be same across deployments?
    secret: process.env.SESSION_SECRET || 'dev-secret',

    // Prevents resaving unchanged sessions
    // Interview Q:
    // 27) Why is resave:false recommended?
    resave: false,

    // Prevents creating empty sessions
    // Interview Q:
    // 28) When does a session actually get created?
    saveUninitialized: false,

    // Cookie configuration (stored in browser)
    cookie: {
      // 7 days expiry
      // Interview Q:
      // 29) What happens when maxAge expires?
      maxAge: 1000 * 60 * 60 * 24 * 7,

      // Prevents JS access → XSS protection
      // Interview Q:
      // 30) How does httpOnly protect against attacks?
      httpOnly: true,

      // HTTPS-only cookies in production
      // Interview Q:
      // 31) Why must secure:true in production?
      secure: process.env.NODE_ENV === 'production',

      // CSRF protection — 'none' required for cross-site cookies in production
      // Interview Q:
      // 32) Difference between strict, lax, and none?
      sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    },

    // Store sessions in MongoDB
    // Interview Q:
    // 33) How does connect-mongo work internally?
    // 34) What happens if MongoDB goes down?
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: 'sessions',
    }),
  })
);


// =======================
// SERVER PORT
// =======================

// Convert string to number
// Interview Q:
// 35) Why is process.env.PORT always a string?
const port = Number(process.env.PORT) || 3000;


// =======================
// ROUTES
// =======================

app.get('/', (req: Request, res: Response) => {
  // Health check route
  // Interview Q:
  // 36) Why do companies keep health check endpoints?
  // 37) How would you protect routes using sessions?
  res.send('Server is Live!');
});

app.use('/api/auth', authrouter);
app.use('/api/thumbnails', thumbnailrouter);
app.use('/api/user', userrouter);
// =======================
// DATABASE CONNECTION
// =======================

// Connect to DB at module level for both local and serverless
connectDB();

// =======================
// SERVER STARTUP (local dev only)
// =======================

// On Vercel, app.listen() is not needed — Vercel handles it via the export
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export the app for Vercel serverless functions
export default app;


// =======================
// CODING QUESTIONS (PRACTICE)
// =======================

// 🔹 Q1: Write middleware to protect routes using req.session.isLoggedIn
// 🔹 Q2: Implement login route that sets req.session.userId
// 🔹 Q3: Implement logout route that destroys session
// 🔹 Q4: How would you regenerate session ID after login?
// 🔹 Q5: How to handle multiple sessions per user?
// 🔹 Q6: Convert this session auth to JWT-based auth
// 🔹 Q7: How to scale this app to multiple servers?
// 🔹 Q8: How to share sessions between multiple backend instances?
// 🔹 Q9: Implement CSRF protection in this setup
// 🔹 Q10: Add Redis instead of MongoDB for sessions
