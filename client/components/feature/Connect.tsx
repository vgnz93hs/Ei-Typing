"use client";

type User = {
    displayName: string;
    uuid: string;
    pulse: string;
};

export default function Connect({
    isConnected,
    handleConnect,
    showCursor,
    room,
}: {
    isConnected: boolean;
    handleConnect: () => void;
    showCursor: boolean;
    room: User[];
}) {
    return (
        <div
            className={`flex flex-col ${!isConnected && "loading"} w-fit items-center gap-4`}
        >
            <div className="flex items-end">
                <h1
                    className="font-mono font-bold flex text-2xl"
                    data-cursor="text"
                >
                    Connected to Server
                </h1>
                <div
                    className={`w-3 h-1 mb-1 flex ml-1 bg-cyan-600 ${!showCursor && "opacity-0"}`}
                />
            </div>

            <button
                data-cursor="button"
                className={`text-lg mt-2 items-center font-bold w-48 justify-center py-2 rounded-lg text-white disabled:text-(--color-foreground)/50 flex transition-all duration-200 ease-out active:scale-95 ${isConnected ? "bg-cyan-600" : "gradient-background"}`}
                data-cursor-shape="0"
                disabled={!isConnected}
                onClick={() => handleConnect()}
            >
                Join
            </button>
        </div>
    );
}
