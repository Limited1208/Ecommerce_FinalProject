import { useEffect } from "react";

export function usePageTitle(title) {
    useEffect(() => {
        document.title = `${title} — STRIKEZON`;
        return () => { document.title = "STRIKEZON"; }; // reset on unmount
    }, [title]);
}