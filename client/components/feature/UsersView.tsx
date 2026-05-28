type User = {
    displayName: string;
    userId: string;
    pulse: string;
};

type Position = {
    x: number;
    y: number;
    w: number;
    h: number;
    opacity: number;
};

export default function UsersView({
    users,
    positions,
    userId,
    currentTurn,
}: Readonly<{
    users: User[];
    positions: Position[];
    userId: string;
    currentTurn: number | null;
}>) {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="w-96 h-96 flex relative">
                {positions.map((position, index) => (
                    <div
                        key={index}
                        className="absolute flex transition-all duration-500 ease-[cubic-bezier(0.1,0.5,0,1)] rounded-full"
                        style={{
                            opacity: `${positions[index].opacity}`,
                            width: `${positions[index].w}px`,
                            height: `${positions[index].h}px`,
                            left: `calc(${positions[index].x + 50}% - ${positions[index].w / 2}px)`,
                            top: `calc(${positions[index].y + 50}% - ${positions[index].h / 2}px)`,
                        }}
                        data-cursor="button"
                        data-cursor-shape="0"
                    >
                        <div className="bg-(--color-foreground) w-full h-full flex rounded-full relative active:scale-95 transition-transform duration-200 ease-out">
                            <div
                                className="absolute flex-col pointer-events-none rounded-full transition-all duration-500 ease-[cubic-bezier(0.1,0.5,0,1)] text-center items-center text-sm pb-2 w-32 flex justify-center"
                                style={{
                                    left: `calc(${positions[index].w / 2}px - 64px)`,
                                    bottom: `calc(${positions[index].h}px + 0px)`,
                                }}
                            >
                                {users[index]?.userId == userId && (
                                    <svg
                                        className="w-fit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="32px"
                                        viewBox="0 -960 960 960"
                                        width="32px"
                                        fill="currentColor"
                                    >
                                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                    </svg>
                                )}
                                {users[index]?.displayName ?? ""}
                            </div>
                        </div>
                    </div>
                ))}

                {currentTurn !== null && (
                    <div
                        className="absolute flex transition-all duration-500 w-4 h-4 ease-[cubic-bezier(0.1,0.5,0,1)] rounded-full"
                        style={{
                            opacity: `${positions[currentTurn].opacity}`,
                            left: `calc(${positions[currentTurn].x + 50}% - ${positions[currentTurn].w / 2 + 4}px)`,
                            top: `calc(${positions[currentTurn].y + 50}% - ${positions[currentTurn].h / 2 + 4}px)`,
                        }}
                        data-cursor="button"
                        data-cursor-shape="0"
                    >
                        <div className="bg-red-500 w-full h-full flex rounded-full relative active:scale-95 transition-transform duration-200 ease-out"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
