"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

type Button = {
    x: number;
    y: number;
    width: number;
    height: number;
    isFilled: boolean;
    borderRadius: number;
};

type Text = {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
};

export function Cursor() {
    const buttons = useRef<Button[]>([]);
    const texts = useRef<Text[]>([]);

    const target = useRef({
        x: 0,
        y: 0,
        width: 25,
        height: 25,
        weight: 4,
        opacity: 0,
        borderRadius: 12.5,
    });
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const isMouseDownRef = useRef(false);

    const springConfig = {
        stiffness: 1000,
        damping: 50,
        mass: 1,
    };

    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const cursorW = useSpring(25, springConfig);
    const cursorH = useSpring(25, springConfig);
    const cursorWeight = useSpring(3, springConfig);
    const cursorOpacity = useSpring(0, springConfig);
    const cursorBorderRadius = useSpring(12.5, springConfig);

    const boxShadow = useTransform(
        cursorWeight,
        (latestWeight) =>
            `0 0 0 ${latestWeight}px inset var(--color-foreground)`,
    );

    useEffect(() => {
        const getElements = () => {
            const buttonElements = document.querySelectorAll(
                '[data-cursor="button"]',
            );
            const textElements = document.querySelectorAll(
                '[data-cursor="text"]',
            );

            buttons.current = Array.from(buttonElements).map((element) => {
                const htmlElement = element as HTMLElement;

                const rect = htmlElement.getBoundingClientRect();

                const style = window.getComputedStyle(htmlElement);

                return {
                    x: rect.left,
                    y: rect.top,

                    width: rect.width,
                    height: rect.height,

                    borderRadius: parseFloat(style.borderRadius),

                    isFilled: htmlElement.dataset.cursorFilled === "true",
                };
            });

            texts.current = Array.from(textElements).map((element) => {
                const htmlElement = element as HTMLElement;

                const rect = htmlElement.getBoundingClientRect();

                const style = window.getComputedStyle(htmlElement);

                return {
                    x: rect.left,
                    y: rect.top,

                    width: rect.width,
                    height: rect.height,

                    fontSize: parseFloat(style.fontSize),
                };
            });
        };

        window.addEventListener("mousedown", () => {
            setIsMouseDown(true);
            isMouseDownRef.current = true;
        });

        window.addEventListener("mouseup", () => {
            setIsMouseDown(false);
            isMouseDownRef.current = false;
        });

        getElements();

        window.addEventListener("resize", getElements);
        window.addEventListener("scroll", getElements);
        window.addEventListener("mousedown", getElements);

        return () => {
            window.removeEventListener("resize", getElements);
            window.removeEventListener("scroll", getElements);
            window.removeEventListener("mousedown", getElements);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const selectedButtons: Button[] = buttons.current.filter(
                (element) => {
                    return (
                        mouseX >= element.x &&
                        mouseX <= element.x + element.width &&
                        mouseY >= element.y &&
                        mouseY <= element.y + element.height
                    );
                },
            );

            const selectedTexts: Text[] = texts.current.filter((element) => {
                return (
                    mouseX >= element.x &&
                    mouseX <= element.x + element.width &&
                    mouseY >= element.y &&
                    mouseY <= element.y + element.height
                );
            });

            if (selectedButtons.length > 0) {
                if (selectedButtons[0].isFilled) {
                    target.current = {
                        x: selectedButtons[0].x + selectedButtons[0].width / 2,
                        y: selectedButtons[0].y + selectedButtons[0].height / 2,
                        width: selectedButtons[0].width + 16,
                        height: selectedButtons[0].height + 16,
                        weight: 4,
                        opacity: 0.5,
                        borderRadius: selectedButtons[0].borderRadius + 8,
                    };
                } else {
                    target.current = {
                        x: selectedButtons[0].x + selectedButtons[0].width / 2,
                        y: selectedButtons[0].y + selectedButtons[0].height / 2,
                        width: selectedButtons[0].width,
                        height: selectedButtons[0].height,
                        weight: 1000,
                        opacity: 0.25,
                        borderRadius: selectedButtons[0].borderRadius,
                    };
                }
            } else if (selectedTexts.length > 0) {
                target.current = {
                    x: e.clientX,
                    y: e.clientY,
                    width: 3,
                    height: selectedTexts[0].fontSize + 10,
                    weight: 2,
                    opacity: 1,
                    borderRadius: 12.5,
                };
            } else {
                target.current = {
                    x: e.clientX,
                    y: e.clientY,
                    width: 25,
                    height: 25,
                    weight: isMouseDownRef.current ? 8 : 4,
                    opacity: 1,
                    borderRadius: 12.5,
                };
            }

            cursorX.set(target.current.x - target.current.width / 2);
            cursorY.set(target.current.y - target.current.height / 2);
            cursorW.set(target.current.width);
            cursorH.set(target.current.height);
            cursorOpacity.set(target.current.opacity);

            const minimumWeight =
                Math.min(target.current.width, target.current.height) / 2;

            cursorWeight.set(Math.min(target.current.weight, minimumWeight));

            cursorBorderRadius.set(
                Math.min(target.current.borderRadius, minimumWeight),
            );
        };

        window.addEventListener("mousemove", handleMouseMove);

        window.addEventListener("mousedown", handleMouseMove);

        window.addEventListener("mouseup", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <motion.div
            className={`
                ${isMouseDown && "scale-95"}
                transition-transform
                duration-200
                ease-out
                pointer-events-none
                fixed
                rounded-full
            `}
            style={{
                opacity: cursorOpacity,
                left: cursorX,
                top: cursorY,
                width: cursorW,
                height: cursorH,
                boxShadow,
                borderRadius: cursorBorderRadius,
            }}
        />
    );
}
