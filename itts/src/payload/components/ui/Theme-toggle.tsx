"use client";

import { useEffect } from "react";

type ThemeMode = "light" | "dark";

export default function ThemeToggle() {

    const applyTheme = (mode: ThemeMode) => {
        document.documentElement.setAttribute("data-theme", mode);
        localStorage.setItem("theme", mode);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeMode | null;

        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, []);

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => applyTheme("light")}>☀ Light</button>
            <button onClick={() => applyTheme("dark")}>🌙 Dark</button>
        </div>
    );
}
