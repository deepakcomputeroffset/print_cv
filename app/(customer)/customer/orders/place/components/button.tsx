"use client";
export default function Button() {
    return (
        <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            Go Back
        </button>
    );
}
