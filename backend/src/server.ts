import 'dotenv/config';
import http from "node:http";
import app from "./app.js";
import { initSocket } from "./realtime/socket.js";

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

// Initialize Socket.io real-time engine
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("❌ Server failed to start:", error);
  process.exit(1);
});
