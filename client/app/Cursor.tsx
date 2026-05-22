"use client";

import { useState, useEffect, useRef } from "react";

export function Cursor() {
    const [tergetPosition, setTergetPosition] = useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });
    const [tergetSize, setTergetSize] = useState<{ x: number; y: number }>({
        x: 25,
        y: 25,
    });
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [size, setSize] = useState<{ x: number; y: number }>({
        x: 25,
        y: 25,
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            className="fixed rounded-full pointer-events-none"
            style={{
                left: `${position.x - size.x / 2}px`,
                top: `${position.y - size.y / 2}px`,
                width: `${size.x}px`,
                height: `${size.y}px`,
            }}
        >
            <div className="w-full h-full bg-white rounded-full" />
        </div>
    );
}
