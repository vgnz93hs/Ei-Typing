import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

type User = {
    displayName: string;
    userId: string;
    pulse?: string;
};

let room: User[] = [];
let isGameStarted = false;
let previousPulse: string = "";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const broadcastRoomInfo = () => {
    io.emit("roomInfo", room);
    io.emit("isGameStarted", isGameStarted);
}

const updateRoom = (fn: (room: User[]) => void) => {
    fn(room);
    broadcastRoomInfo();
}

setInterval(() => {
    updateRoom((r) => {
        for (let i = r.length - 1; i >= 0; i--) {
            if (r[i].pulse !== previousPulse) {
                console.log("user kicked:", previousPulse, "!=", r[i].pulse);
                r.splice(i, 1);

                isGameStarted = false;
            }
        }
    });

    const sharedUUID = crypto.randomUUID();
    io.emit("pulse", sharedUUID);
    console.log("Pulse sent📡:", sharedUUID);
    previousPulse = sharedUUID;
}, 1000);

io.on("connection", (socket) => {
    const ip = socket.handshake.address;
    const origin = socket.handshake.headers.origin;
    const userAgent = socket.handshake.headers["user-agent"];
    let userId: string | null = null;

    console.log("Connected👍:", socket.id);
    console.log("IP:", ip);
    console.log("Origin:", origin);
    console.log("UA:", userAgent);

    socket.on("fetch", () => {
        console.log("Room Info Requested:", ip);
        socket.emit("roomInfo", room);
        socket.emit("isGameStarted", isGameStarted);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });

    socket.on("joinRoom", (displayName: string) => {
        if (room.length < 4 && !isGameStarted) {
            const uuid = crypto.randomUUID();
            updateRoom((r) => r.push({ displayName, userId: uuid, pulse: previousPulse }));
            socket.emit("joined", uuid);
            userId = uuid;
        }
    });

    socket.on("startGame", () => {
        if (userId && room.map((user) => user.userId).includes(userId) && room.length < 5 && room.length > 1) {
            isGameStarted = true;
            console.log("Game Started 🎮");

            broadcastRoomInfo();
        }
    })

    socket.on("pulseResponse", (response: { userId: string; newPulse: string }) => {
        updateRoom((r) => {
            for (let i = r.length - 1; i >= 0; i--) {
                if (r[i].userId == userId) {
                    r[i].pulse = response.newPulse
                }
            }
        });
        console.log("Pulse response received📡:", response.newPulse, "Current Users", room);
    });
});

httpServer.listen(3001, () => {
    console.log("Socket.IO Server running on :3001");
});