"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Keys } from "@/components/ui/Keys";
import { io } from "socket.io-client";

type User = {
    displayName: string;
    uuid: string;
    pulse: string;
};

const socket = io("http://localhost:3001");

export default function Connect() {
    const [isSelected, setIsSelected] = useState(false); // Whether the play button is selected
    const [showCursor, setShowCursor] = useState(false);
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<User[]>([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        const intervalId2 = setInterval(() => {
            socket.emit("fetch", "");
        }, 1000);

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("roomInfo", (roomInfo) => {
            setRoom(roomInfo);
        });

        return () => {
            socket.disconnect();
            intervalId.close();
            intervalId2.close();
        };
    }, []);

    const handleConnect = () => {
        socket.emit("joinRoom", "vgnz93s");
    };

    return (
        <div
            className={`h-full flex flex-col ${!isConnected && "loading"} items-center gap-4 pt-16`}
        >
            <div className="flex items-end">
                <h1 className="font-mono font-bold text-2xl" data-cursor="text">
                    Connect to Server
                </h1>
                <div
                    className={`w-3 h-1 mb-1 ml-1 bg-cyan-600 ${!showCursor && "opacity-0"}`}
                />
            </div>

            <button
                data-cursor="button"
                className={`text-lg mt-2 items-center font-bold w-48 justify-center py-2 rounded-lg text-white disabled:text-(--color-foreground)/50 flex transition-all duration-200 ease-out active:scale-95 ${isConnected ? "bg-cyan-600" : "gradient-background"}`}
                data-cursor-shape="0"
                disabled={!isConnected}
                onClick={() => handleConnect()}
            >
                Join
            </button>

            <div className={`${isConnected ? "" : "hidden"}`}>Connected</div>

            {room.map((user) => (
                <div
                    key={user.uuid}
                    className="bg-(--color-background-secondary) w-48 py-2 px-3 line-clamp-1 truncate font-mono font-bold"
                    data-cursor="text"
                >
                    {user.displayName}
                </div>
            ))}
        </div>
    );
}
