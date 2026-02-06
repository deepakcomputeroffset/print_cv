import { auth } from "@/lib/auth";
import { sseManager } from "@/lib/sse/connection-manager";
import { ROLE } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await auth();

    if (
        !session?.user ||
        session.user.userType !== "staff" ||
        !session.user.staff
    ) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.staff.id;
    const role = session.user.staff.role as ROLE;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            const connection = {
                controller,
                userId,
                role,
                userType: "staff" as const,
            };

            sseManager.addConnection(connection);

            // Send initial connection success event
            try {
                controller.enqueue(
                    encoder.encode(
                        `event: connected\ndata: ${JSON.stringify({ userId, role })}\n\n`,
                    ),
                );
            } catch {
                sseManager.removeConnection(connection);
            }

            // Keep-alive ping every 30 seconds
            const keepAlive = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(": keep-alive\n\n"));
                } catch {
                    clearInterval(keepAlive);
                    sseManager.removeConnection(connection);
                }
            }, 30_000);

            // Cleanup when client disconnects
            // The AbortSignal is not directly available here,
            // so we rely on enqueue errors to detect disconnects.
            // The connection is removed in catch blocks above.
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no", // Disable buffering for Nginx
        },
    });
}
