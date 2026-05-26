"use client";

import Connect from "@/components/feature/Connect";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Keys } from "@/components/ui/Keys";
import { io } from "socket.io-client";
import UsersView from "@/components/feature/UsersView";
import { join } from "node:path/win32";

type User = {
    displayName: string;
    uuid: string;
    pulse: string;
};

type Position = {
    x: number;
    y: number;
    w: number;
    h: number;
    opacity: number;
};

export default function Page() {
    const [showCursor, setShowCursor] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<User[]>([]);
    const [uuid, setUuid] = useState("");
    const [cameraAngle, setCameraAngle] = useState(1);
    const [displayName, setDisplayName] = useState<string>(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("display-name") ?? "";
    });
    const socketRef = useRef<ReturnType<typeof io> | null>(null);
    const router = useRouter();
    const [userPositions, setUserPositions] = useState<Position[]>(
        Array.from({ length: 4 }, () => ({
            x: 0,
            y: 0,
            w: 24,
            h: 24,
            opacity: 0,
        })),
    );

    useEffect(() => {
        const socket = io("http://localhost:3001");
        socketRef.current = socket;

        const intervalId = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        const intervalId2 = setInterval(() => {
            socket.emit("fetch", "");
        }, 1000);

        socket.on("connect", () => {});

        socket.on("roomInfo", (roomInfo) => {
            setIsConnected(true);
            setRoom(roomInfo);
            setCameraAngle(
                roomInfo.length == 1 || roomInfo.length == 0 ? 3 : 1,
            );
        });

        socket.on("joined", (myUuid) => {
            setUuid(myUuid);
        });

        return () => {
            socket.disconnect();
            clearInterval(intervalId);
            clearInterval(intervalId2);
        };
    }, [router]);

    const handleConnect = () => {
        socketRef.current?.emit("joinRoom", "vgnz93s");
    };

    return (
        <div className="flex w-full h-full">
            <div className="w-full flex">
                <UsersView users={room ?? []} positions={userPositions} />
            </div>
            <div className={`w-2xl pr-4 py-4 h-full justify-end flex flex-col`}>
                <div
                    className={`flex flex-col bg-(--color-background-secondary) transition-all duration-200 ease-out ${room.some((user) => user.uuid === uuid) ? "h-full" : isConnected ? "h-64" : "h-32"} rounded-2xl p-4 w-full`}
                >
                    {isConnected ? (
                        <div className="h-full w-full flex flex-col gap-8 justify-center items-center">
                            <div
                                className="font-mono font-bold text-lg"
                                data-cursor="text"
                            >
                                Connected
                            </div>
                            <div className="flex flex-col gap-4">
                                <div
                                    className="rounded-lg w-48 flex"
                                    data-cursor="button"
                                    data-cursor-shape="0"
                                >
                                    <button
                                        data-cursor="button"
                                        className="items-center font-bold bg-cyan-600 w-full justify-center py-2 rounded-lg text-white h-fit flex transition-all duration-200 ease-out active:scale-95"
                                        data-cursor-shape="0"
                                        onClick={() => handleConnect()}
                                    >
                                        Join
                                    </button>
                                </div>
                                <div
                                    className="rounded-lg w-48 flex"
                                    data-cursor="button"
                                    data-cursor-shape="1"
                                >
                                    <button
                                        className="items-center text-center justify-center font-bold py-2 w-full text-cyan-600 h-fit flex transition-all duration-200 ease-out active:scale-95"
                                        onClick={() => handleConnect()}
                                    >
                                        Watch Only
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center flex-col h-full items-center">
                            <div
                                className="font-mono font-bold text-lg gradient-text"
                                data-cursor="text"
                            >
                                Connecting to Server…
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
