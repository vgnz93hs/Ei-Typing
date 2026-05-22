"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
    const [isSelected, setIsSelected] = useState(false); // Whether the play button is selected
    const [showCursor, setShowCursor] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    return (
            <div className="flex flex-col justify-center h-full items-center gap-16">
                <div className="flex items-end">
                    <h1
                        className="font-mono font-bold text-2xl"
                        data-cursor="text"
                    >
                        Ei Typing
                    </h1>
                    <div
                        className={`w-3 h-1 mb-1 ml-1 bg-(--color-foreground) ${!showCursor && "opacity-0"}`}
                    />
                </div>

                <button
                    data-cursor="button"
                    className="text-lg font-bold bg-(--color-foreground) w-32 justify-center py-2 rounded-md text-(--color-background) flex transition-transform duration-200 ease-out active:scale-95 z-1000"
                    data-cursor-filled="true"
                    onMouseEnter={() => {
                        setIsSelected(true);
                    }}
                    onMouseLeave={() => {
                        setIsSelected(false);
                    }}
                >
                    <div
                        className={`${isSelected ? "w-5" : "w-0"} transition-all duration-200 ease-out flex overflow-hidden`}
                    >
                        ▶
                    </div>
                    <div>Play</div>
                </button>

                <button
                    data-cursor="button"
                    className="font-bold px-2 py-1 rounded-md text-(--color-foreground) transition-transform duration-200 ease-out active:scale-95 inline-block z-1000"
                    data-cursor-filled="false"
                >
                    Settings
                </button>
            </div>
    );
}
