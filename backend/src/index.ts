import app from "./server.ts";
import env, { isProd } from "../env.ts";
import http from "http";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import { verifyToken } from "./utils/jwt.ts";
import { initializeDatabase } from "./db/connections.ts";

const httpServer = isProd()
  ? http.createServer(app)
  : https.createServer({
      key: fs.readFileSync("./certs/localhost+1-key.pem"),
      cert: fs.readFileSync("./certs/localhost+1.pem")
    }, app);


// io will be used as a server variable to handle socket connections and events
export const io = new Server(httpServer, {
  cors: {
    origin: "https://www.attendscan.app",
    credentials: true,
  }
});


// Middleware to authenticate the JWT token for socket connections
io.use(async (socket, next) => {
  try {
    
    const authToken = socket.handshake.auth?.token;
    const cookieToken = socket.handshake.headers.cookie
      ?.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
    const token = typeof authToken === "string"
      ? authToken
      : cookieToken
        ? decodeURIComponent(cookieToken)
        : undefined;
    
    if (!token || typeof token !== "string") {
      return next(new Error("Authentication token is required"));
    }
    
    // Remove the "Bearer " prefix if present
    const rawToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const payload = await verifyToken(rawToken);
    
    // Attach the user payload to the socket object
    socket.data.user = payload;
    return next();
    
  } 
  catch (error) {
    return next(new Error("Invalid or expired token"));
  }
});


//connection event listener for socket.io
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // Get the user id from the socket, socket is a open connection so it 
  // receives live requests and responses
  const userId = socket.data.user!.id;
  
  if (!userId) {
    console.error("User ID not found in socket data. Disconnecting socket.");
    socket.disconnect(true);
    return;
  }
  
  //join a room specific to the userId to send targeted notifications
  socket.join(`userId-${userId}`);
});


const startServer = async () => {
  try {
    await initializeDatabase();
    httpServer.listen(env.PORT, "0.0.0.0", () => {
      const protocol = isProd() ? "http" : "https";
      console.log(`Server is running on ${protocol}://localhost:${env.PORT}`);
    });
  }
  catch (error) {
    console.error("Unable to connect to the database. Server was not started:", error);
    process.exit(1);
  }
};

startServer();