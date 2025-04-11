import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl.searchParams.get("url");

        if (!url) {
            return NextResponse.json(
                { error: "URL parameter is required" },
                { status: 400 },
            );
        }

        // For Google Cloud Storage URLs, we need special handling
        const fetchOptions: RequestInit = {
            method: "GET",
            headers: {
                Accept: "*/*",
                "User-Agent": "Mozilla/5.0 PrintingPress/1.0",
            },
            cache: "no-cache",
        };

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorStatus = response.status;
            let errorBody = "";
            try {
                errorBody = await response.text();
            } catch (e) {
                errorBody = `Could not read error response body: ${e}`;
            }

            return NextResponse.json(
                {
                    error: `Failed to fetch resource`,
                    status: errorStatus,
                    statusText: response.statusText,
                    body: errorBody,
                },
                { status: 502 },
            );
        }

        // Get the content type and ensure it's properly set
        let contentType =
            response.headers.get("content-type") || "application/octet-stream";

        // For images without explicit types, try to determine from URL
        if (
            contentType === "application/octet-stream" ||
            contentType === "binary/octet-stream"
        ) {
            if (url.endsWith(".jpg") || url.endsWith(".jpeg"))
                contentType = "image/jpeg";
            else if (url.endsWith(".png")) contentType = "image/png";
            else if (url.endsWith(".gif")) contentType = "image/gif";
            else if (url.endsWith(".pdf")) contentType = "application/pdf";
        }

        // Get the binary data
        const arrayBuffer = await response.arrayBuffer();

        if (arrayBuffer.byteLength === 0) {
            return NextResponse.json(
                { error: "Empty response from origin server" },
                { status: 502 },
            );
        }

        const headers = new Headers({
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });

        // Add content length header
        headers.set("Content-Length", arrayBuffer.byteLength.toString());

        return new NextResponse(arrayBuffer, { headers });
    } catch (error) {
        console.error("Detailed proxy error:", error);
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
            console.error("Error stack:", error.stack);
        }

        return NextResponse.json(
            {
                error: "Failed to proxy resource",
                details: errorMessage,
            },
            { status: 500 },
        );
    }
}
