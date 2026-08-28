import app from "./server.ts";
import env from "../env.ts";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import { verifyToken } from "./utils/jwt.ts";

const httpsOptions = {
  key: fs.readFileSync("./certs/localhost+1-key.pem"),
  cert: fs.readFileSync("./certs/localhost+1.pem")
};

const httpServer = https.createServer(httpsOptions, app);


// io will be used as a server variable to handle socket connections and events
export const io = new Server(httpServer, {
  cors: {
    origin: "https://localhost:5173",
    credentials: true,
  }
});


// Middleware to authenticate the JWT token for socket connections
io.use(async (socket, next) => {
  try {
    
    // Extract the token from the socket handshake query parameters
    const token = socket.handshake.auth?.token;
    
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
  console.log(`User ${userId} joined room: userId-${userId}`);
  
  //disconnection event listener for socket.io
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


httpServer.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Server is running on https://localhost:${env.PORT}`);
});