"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const router = useRouter();

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "CredentialsSignin":
                return "Invalid email or password. Please try again.";
            case "AccessDenied":
                return "You do not have permission to access this resource.";
            case "OAuthSignin":
                return "Failed to sign in with OAuth provider.";
            case "SessionRequired":
                return "You must be signed in to access this page.";
            default:
                return "An unknown error occurred. Please try again.";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-600">
                    Authentication Error
                </h1>
                <p className="mt-4 text-gray-700">{getErrorMessage(error)}</p>
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
