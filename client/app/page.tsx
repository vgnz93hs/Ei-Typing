"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
    const [isSelected, setIsSelected] = useState(false); // Whether the play button is selected

    return (
        <main className="flex flex-col justify-center items-center h-screen gap-16">
            <h1 className="font-mono font-bold text-2xl">Ei Typing</h1>

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
        </main>
    );
}
