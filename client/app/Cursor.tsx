"use client"

import { useState, useEffect, useRef } from "react"

export function Cursor() {
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, []);

    return <div className="fixed w-4 h-4 rounded-full border border-white pointer-events-none" style={{ left: `${position.x}px`, top: `${position.y}px` }} />;
}