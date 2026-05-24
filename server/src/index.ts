import express from "express";
import { createServer } from "http";
import { randomUUID, UUID } from "crypto";
import { Server } from "socket.io";

type User = {
    displayName: string,
    uuid: string,
    pulse?: string,
}

let room: User[] = [];

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    // 接続元情報
    const ip = socket.handshake.address;
    const origin = socket.handshake.headers.origin;
    const userAgent = socket.handshake.headers["user-agent"];

    console.log("接続:", socket.id);
    console.log("IP:", ip);
    console.log("Origin:", origin);
    console.log("UA:", userAgent);

    socket.on("message", (msg: string) => {
        console.log("受信:", msg);

        socket.emit("message", `受信した: ${msg}`);
    });

    socket.on("fetch", () => {
        socket.emit("roomInfo", room);
    });

    socket.on("disconnect", () => {
        console.log("切断:", socket.id);
    });

    socket.on("joinRoom", (displayName: string) => {
        const uuid: string = crypto.randomUUID();
        room.push({ displayName: displayName, uuid: uuid })

        socket.emit("joined", uuid);
    });

    const watchedData = new Proxy(room, {
        set(target, prop, value) {
            socket.broadcast.emit("roomInfo", room);
            return true;
        }
    });
});

httpServer.listen(3001, () => {
    console.log("Socket.IO Server running on :3001");
});