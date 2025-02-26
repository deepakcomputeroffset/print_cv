"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function AuthErrorPage() {
    return (
        <Suspense>
            <AuthError />
        </Suspense>
    );
}
function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-600">
                    Authentication Error
                </h1>
                <p className="mt-4 text-gray-700">{error}</p>
                <button
                    className="mt-4 inline-block text-blue-600 hover:underline"
                    onClick={() => router.back()}
                >
                    Go back to Login
                </button>
            </div>
        </div>
    );
}
