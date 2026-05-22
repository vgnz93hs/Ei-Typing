import Image from "next/image";

export default function Home() {
    return (
        <main className="flex justify-center items-center h-screen gap-16">
            <button
                data-cursor="button"
                className="text-2xl font-bold bg-(--color-foreground) p-4 rounded-md text-(--color-background) transition-transform duration-200 ease-out active:scale-95 inline-block z-1000"
                data-cursor-filled="true"
            >
                test
            </button>

            <button
                data-cursor="button"
                className="text-2xl font-bold p-4 rounded-md text-(--color-foreground) transition-transform duration-200 ease-out active:scale-95 inline-block z-1000"
                data-cursor-filled="false"
            >
                test2
            </button>
        </main>
    );
}
