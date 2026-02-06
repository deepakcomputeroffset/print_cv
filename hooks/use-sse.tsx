"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type SSEEventHandler = (data: Record<string, unknown>) => void;

export function useSSE(url: string) {
    const eventSourceRef = useRef<EventSource | null>(null);
    const handlersRef = useRef<Map<string, Set<SSEEventHandler>>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef =
        useRef<ReturnType<typeof setTimeout>>(undefined);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 10;

    // Wraps a handler into an EventListener that parses JSON
    const wrapHandler = useCallback(
        (handler: SSEEventHandler): EventListener => {
            return ((event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    handler(data);
                } catch (e) {
                    console.error("[SSE] Error parsing event data:", e);
                }
            }) as EventListener;
        },
        [],
    );

    // Attach all registered handlers to an EventSource
    const attachAllListeners = useCallback(
        (es: EventSource) => {
            for (const [eventType, handlers] of handlersRef.current) {
                for (const handler of handlers) {
                    es.addEventListener(eventType, wrapHandler(handler));
                }
            }
        },
        [wrapHandler],
    );

    const connect = useCallback(() => {
        // Don't connect if already connected
        if (eventSourceRef.current?.readyState === EventSource.OPEN) return;

        // Close existing connection
        eventSourceRef.current?.close();

        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.addEventListener("connected", () => {
            setIsConnected(true);
            reconnectAttempts.current = 0;
            console.log("[SSE] Connected");
        });

        // Attach any handlers that were registered before connect
        attachAllListeners(es);

        es.onerror = () => {
            setIsConnected(false);
            es.close();

            if (reconnectAttempts.current < maxReconnectAttempts) {
                const delay = Math.min(
                    1000 * Math.pow(2, reconnectAttempts.current),
                    30000,
                );
                console.log(
                    `[SSE] Reconnecting in ${delay / 1000}s... (attempt ${reconnectAttempts.current + 1})`,
                );
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectAttempts.current++;
                    connect();
                }, delay);
            }
        };
    }, [url, attachAllListeners]);

    const on = useCallback(
        (eventType: string, handler: SSEEventHandler) => {
            if (!handlersRef.current.has(eventType)) {
                handlersRef.current.set(eventType, new Set());
            }
            handlersRef.current.get(eventType)!.add(handler);

            // Always add listener to existing EventSource (works in any readyState)
            const es = eventSourceRef.current;
            if (es && es.readyState !== EventSource.CLOSED) {
                es.addEventListener(eventType, wrapHandler(handler));
            }

            // Return cleanup function
            return () => {
                handlersRef.current.get(eventType)?.delete(handler);
            };
        },
        [wrapHandler],
    );

    useEffect(() => {
        connect();

        return () => {
            clearTimeout(reconnectTimeoutRef.current);
            eventSourceRef.current?.close();
            setIsConnected(false);
        };
    }, [connect]);

    return { isConnected, on };
}
