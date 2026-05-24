"use client";

type User = {
    displayName: string;
    uuid: string;
    pulse: string;
};

export default function Client({ room }: { room: User[] }) {
    const radius = 100;

    const userPositions = room.map((_, index) => {
        const angle = (2 * Math.PI * index) / room.length;

        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    });

    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full">
            <div className="relative w-64 h-64 rounded-2xl bg-(--color-background-secondary)">
                {userPositions.map((position, index) => (
                    <div
                        key={index}
                        className="absolute w-12 transition-all ease-out duration-200 h-12 rounded-full bg-cyan-600"
                        style={{
                            left: `calc(50% + ${position.x}px - 24px)`,
                            top: `calc(50% + ${position.y}px - 24px)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
