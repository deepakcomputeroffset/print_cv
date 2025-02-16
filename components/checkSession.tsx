"use client";

import axios from "axios";
import { useEffect } from "react";

export default function CheckSession() {
    useEffect(() => {
        const session = async () => {
            await axios("/api/isExist");
        };

        const interval = setInterval(session, 1000 * 60 * 15);

        return () => clearInterval(interval);
    }, []);
    return <></>;
}
