"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((registration) => {
                        // SW registered
                    })
                    .catch((registrationError) => {
                        // SW registration failed
                    });
            });
        }
    }, []);

    return null;
}
