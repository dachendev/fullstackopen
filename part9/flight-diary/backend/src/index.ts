import express from "express";
import diaryRouter from "./routes/diaries";
import cors from "cors";
import process from "node:process";
import http from "node:http";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const closeGracefully = (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log("Server shut down.");
    process.exit(0);
  });

  server.closeAllConnections();

  setTimeout(() => {
    console.log("Forcing shutdown due to timeout.");
    process.kill(process.pid, signal);
  }, 10000);
};

process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);