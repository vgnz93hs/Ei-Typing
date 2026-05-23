"use client";

import { useState, useEffect } from "react";

export default function Settings() {
    const [serverUrl, setServerUrl] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("server-url") || "";
        }
        return "";
    });

    const handleSave = (url: string) => {
        setServerUrl(url);
        localStorage.setItem("server-url", url);
    };

    return (
        <div className="h-full flex flex-col gap-4 pt-16">
            <h1 data-cursor="text" className="font-bold">
                Settings
            </h1>
            <div data-cursor="text">Overwrite Connection</div>
            <div className="flex">
                <input
                    placeholder="Server URL"
                    type="url"
                    value={serverUrl}
                    data-cursor="text"
                    onChange={(e) => {
                        setServerUrl(e.target.value);
                        handleSave(e.target.value);
                    }}
                    className="outline-1"
                />
                <button
                    className="bg-cyan-600"
                    data-cursor="button"
                    data-cursor-shape="2"
                    onClick={() => {
                        setServerUrl("");
                        handleSave("");
                    }}
                >
                    Use Default
                </button>
            </div>
        </div>
    );
}
