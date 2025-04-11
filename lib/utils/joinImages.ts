/**
 * Joins two images (A and B) horizontally, where image B has a fixed size and returns the result as base64
 * @param imageABase64 Base64 string of image A (will be resized)
 * @param imageBBase64 Base64 string of image B (fixed size)
 * @param imageBWidth Fixed width for image B (default: 338)
 * @param imageBHeight Fixed height for image B (default: 204)
 * @param totalWidth Total width of the joined image (default: 676)
 * @returns Promise that resolves to base64 string of the joined image
 */

export function joinImages(
    imageABase64: string,
    imageBBase64: string,
    imageBWidth: number = 338,
    imageBHeight: number = 204,
    totalWidth: number = 676,
): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const imageA = new Image();
            const imageB = new Image();

            let loadedImages = 0;
            const totalImages = 2;

            // Function to check if both images are loaded
            const checkImagesLoaded = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    processImages();
                }
            };

            // Process and join the images once loaded
            const processImages = () => {
                // Create canvas
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                // Set canvas dimensions
                const totalHeight = imageBHeight;
                canvas.width = totalWidth;
                canvas.height = totalHeight;

                // Calculate dimensions for image A
                const aWidth = totalWidth - imageBWidth;
                const aHeight = totalHeight;
                const aAspectRatio = imageA.width / imageA.height;

                let drawWidth: number;
                let drawHeight: number;

                // Determine how to scale image A to maintain aspect ratio
                if (aAspectRatio > aWidth / aHeight) {
                    // Width constrained - fill width completely
                    drawWidth = aWidth;
                    drawHeight = drawWidth / aAspectRatio;

                    // Center vertically
                    const offsetY = (aHeight - drawHeight) / 2;
                    ctx.drawImage(imageA, 0, offsetY, drawWidth, drawHeight);
                } else {
                    // Height constrained - fill height completely
                    drawHeight = aHeight;
                    drawWidth = drawHeight * aAspectRatio;

                    // Align right edge with image B (no gap)
                    const offsetX = aWidth - drawWidth;
                    ctx.drawImage(imageA, offsetX, 0, drawWidth, drawHeight);
                }

                // Draw image B (fixed size)
                ctx.drawImage(imageB, aWidth, 0, imageBWidth, imageBHeight);

                // Convert canvas to base64
                const joinedImageBase64 = canvas.toDataURL("image/png");
                resolve(joinedImageBase64);
            };

            // Set up image load handlers
            imageA.onload = checkImagesLoaded;
            imageB.onload = checkImagesLoaded;

            // Set image sources (which will trigger loading)
            imageA.src = imageABase64;
            imageB.src = imageBBase64;
        } catch (error) {
            reject(error);
        }
    });
}
