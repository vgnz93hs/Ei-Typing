import { useEffect, useRef, useState } from "react";

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

    const [currentSelection, setCurrentSelection] = useState(0);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [charInput, setCharInput] = useState("");

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
                <div className="font-bold text-center w-fit border border-(--color-border) px-2 rounded-lg py-1">
                    {japanese}
                </div>
            </div>

            {english && (
                <div className="w-full flex justify-center">
                    <div
                        className="w-fit
                        rounded-lg border border-(--color-border) overflow-clip gap-y-3 flex-wrap flex justify-start"
                    >
                        {[...english].map((char, index) =>
                            char === " " ? (
                                <div className="w-4 h-10" key={index} />
                            ) : (
                                <button
                                    key={index}
                                    className={`
                                        font-bold
                                        flex
                                        items-center
                                        justify-center
                                        w-6
                                        h-10
                                        text-xl
                                        transition-all
                                        duration-150
                                        ease-out
                                        border-(--color-border)

                                        ${
                                            index === currentSelection &&
                                            "bg-(--color-border)"
                                        }
                                    `}
                                    data-cursor="text"
                                    onClick={() => {
                                        setCurrentSelection(index);

                                        requestAnimationFrame(() => {
                                            inputRef.current?.focus();
                                        });
                                    }}
                                >
                                    {input[index]}
                                </button>
                            ),
                        )}

                        <input
                            ref={inputRef}
                            value={charInput}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (!value) return;

                                const char = value.slice(-1);

                                const next = [...input];
                                next[currentSelection] = char;

                                setInput(next);

                                setCharInput("");

                                let nextIndex = currentSelection + 1;

                                while (english[nextIndex] === " ") {
                                    nextIndex++;
                                }

                                if (nextIndex < english.length) {
                                    setCurrentSelection(nextIndex);
                                }
                            }}
                            onKeyDown={(e) => {
                                // ←
                                if (e.key === "ArrowLeft") {
                                    e.preventDefault();

                                    let next = currentSelection - 1;

                                    while (english[next] === " ") {
                                        next--;
                                    }

                                    setCurrentSelection(Math.max(0, next));
                                }

                                if (e.key === "ArrowRight") {
                                    e.preventDefault();

                                    let next = currentSelection + 1;

                                    while (english[next] === " ") {
                                        next++;
                                    }

                                    setCurrentSelection(
                                        Math.min(english.length - 1, next),
                                    );
                                }

                                if (e.key === "Backspace") {
                                    e.preventDefault();

                                    const next = [...input];

                                    if (next[currentSelection]) {
                                        next[currentSelection] = "";
                                        setInput(next);
                                        return;
                                    }

                                    let prev = currentSelection - 1;

                                    while (english[prev] === " ") {
                                        prev--;
                                    }

                                    if (prev >= 0) {
                                        next[prev] = "";

                                        setInput(next);
                                        setCurrentSelection(prev);
                                    }
                                }
                            }}
                            className="
                                absolute
                                opacity-0
                                pointer-events-none
                            "
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
