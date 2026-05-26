"use client";

import Connect from "@/components/feature/Connect";
import Client from "./Clinet";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Keys } from "@/components/ui/Keys";
import { io } from "socket.io-client";
import { join } from "node:path/win32";

type User = {
    displayName: string;
    uuid: string;
    pulse: string;
};

const socket = io("http://localhost:3001");

export default function Page() {
    const [showCursor, setShowCursor] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<User[]>([]);
    const [uuid, setUuid] = useState("");
    const [cameraAngle, setCameraAngle] = useState(1);

    useEffect(() => {
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
            intervalId.close();
            intervalId2.close();
        };
    }, []);

    const handleConnect = () => {
        socket.emit("joinRoom", "vgnz93s");
    };

    return (
        <div className="h-full w-full">
            {isConnected && (
                <Client uuid={uuid} room={room} cameraAngle={cameraAngle} />
            )}
            <div
                className={`bg-(--color-border) transition-opacity duration-200 ease-out ${uuid && "hidden"} w-full h-full fixed left-0 top-0 flex justify-center items-center`}
            >
                <div className="bg-white w-fit px-8 pb-8 pt-6 rounded-4xl">
                    <Connect
                        room={room}
                        isConnected={isConnected}
                        handleConnect={() => handleConnect()}
                        showCursor={showCursor}
                    />
                    <h3>{uuid}</h3>
                </div>
            </div>
        </div>
    );
}
