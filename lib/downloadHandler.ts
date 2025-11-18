export const downloadHandler = async (url: string) => {
    try {
        // Fetch the file from Google Cloud Storage
        const response = await fetch(url, { mode: "cors" });
        const blob = await response.blob();

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Extract filename from URL
        const filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];

        // Create and trigger download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = decodeURIComponent(filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
    }
};
