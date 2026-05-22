"use client";

import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export function Cursor() {
    const [target, setTarget] = useState({
        x: 0,
        y: 0,
        width: 25,
        height: 25,
        weight: 0,
    });

    const springConfig = { stiffness: 1000, damping: 50, mass: 1 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const cursorW = useSpring(25, springConfig);
    const cursorH = useSpring(25, springConfig);
    const cursorWeight = useSpring(25, springConfig);

    useEffect(() => {
        cursorX.set(target.x - target.width / 2);
        cursorY.set(target.y - target.height / 2);
        cursorW.set(target.width);
        cursorH.set(target.height);
        cursorWeight.set(target.weight);
    }, [target, cursorX, cursorY, cursorW, cursorH]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setTarget({
                x: e.clientX,
                y: e.clientY,
                width: 25,
                height: 25,
                weight: 0,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <motion.div
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                x: cursorX,
                y: cursorY,
                width: cursorW,
                height: cursorH,
                pointerEvents: "none",
                backgroundColor: "black",
                borderRadius: "50%",
            }}
        >
            <div className="w-full h-full bg-white rounded-full" />
        </motion.div>
    );
}
