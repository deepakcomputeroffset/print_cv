import { ROLE } from "@prisma/client";

export type SSEConnection = {
    controller: ReadableStreamDefaultController;
    userId: number;
    role: ROLE;
    userType: "staff" | "customer";
};

class SSEConnectionManager {
    private connections: Map<number, Set<SSEConnection>> = new Map();

    addConnection(connection: SSEConnection) {
        const { userId } = connection;
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set());
        }
        this.connections.get(userId)!.add(connection);
        console.log(
            `[SSE] User ${userId} connected. Total connections for user: ${this.connections.get(userId)!.size}`,
        );
    }

    removeConnection(connection: SSEConnection) {
        const { userId } = connection;
        const userConnections = this.connections.get(userId);
        if (userConnections) {
            userConnections.delete(connection);
            if (userConnections.size === 0) {
                this.connections.delete(userId);
            }
        }
        console.log(
            `[SSE] User ${userId} disconnected. Remaining: ${this.connections.get(userId)?.size ?? 0}`,
        );
    }

    /** Send event to a specific user (all their tabs) */
    sendToUser(userId: number, event: SSEEvent) {
        const userConnections = this.connections.get(userId);
        if (!userConnections) return;

        const data = formatSSE(event);
        for (const conn of userConnections) {
            try {
                conn.controller.enqueue(data);
            } catch {
                this.removeConnection(conn);
            }
        }
    }

    /** Send event to all users with specific roles */
    sendToRoles(roles: ROLE[], event: SSEEvent) {
        const data = formatSSE(event);
        for (const [, userConnections] of this.connections) {
            for (const conn of userConnections) {
                if (conn.userType === "staff" && roles.includes(conn.role)) {
                    try {
                        conn.controller.enqueue(data);
                    } catch {
                        this.removeConnection(conn);
                    }
                }
            }
        }
    }

    /** Send event to all connected clients */
    broadcast(event: SSEEvent) {
        const data = formatSSE(event);
        for (const [, userConnections] of this.connections) {
            for (const conn of userConnections) {
                try {
                    conn.controller.enqueue(data);
                } catch {
                    this.removeConnection(conn);
                }
            }
        }
    }

    getConnectionCount(): number {
        let count = 0;
        for (const [, conns] of this.connections) {
            count += conns.size;
        }
        return count;
    }
}

export type SSEEvent = {
    type: string;
    data: Record<string, unknown>;
};

const encoder = new TextEncoder();

function formatSSE(event: SSEEvent): Uint8Array {
    return encoder.encode(
        `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`,
    );
}

// Singleton — shared across all API routes in the same process
const globalForSSE = globalThis as unknown as {
    sseConnectionManager: SSEConnectionManager;
};

export const sseManager =
    globalForSSE.sseConnectionManager ?? new SSEConnectionManager();

if (process.env.NODE_ENV !== "production") {
    globalForSSE.sseConnectionManager = sseManager;
}
