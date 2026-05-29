import { useRef, useState } from "react";

export default function TypingView({
    japanese,
    english,
}: {
    japanese: string;
    english: string | null;
}) {
    const [input, setInput] = useState<string[]>(
        english ? Array(english.length).fill("") : [],
    );

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
                <div className="font-bold text-center w-fit border border-(--color-border) px-2 rounded-lg py-1">
                    {japanese}
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-fit gap-2 flex justify-start">
                    {input.map((char, index) => (
                        <div
                            key={index}
                            className="font-bold text-center w-8 h-12 text-2xl border border-(--color-border) rounded-lg caret-transparent"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
