export async function convertImageToBase64(
    imageArrayBuffer: ArrayBuffer,
    mimeType: string = "image/png",
    includeMimeType: boolean = true,
): Promise<string> {
    if (typeof window === "undefined") {
        throw new Error("This function must run in the browser");
    }

    // Convert ArrayBuffer to Blob
    const blob = new Blob([imageArrayBuffer], { type: mimeType });

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(includeMimeType ? result : result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No file selected"));
            return;
        }
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            resolve(event.target?.result as string);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}
