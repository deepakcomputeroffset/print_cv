import { CUSTOMER_CATEGORY, order, product, productItem } from "@prisma/client";
import JsBarcode from "jsbarcode";
import { joinImages } from "./joinImages";
import { convertFileToBase64 } from "./imageToBase64";

interface LabelOrder extends order {
    productItem: productItem & {
        product: product;
    };
    customer?: {
        businessName: string;
        name: string;
        phone: string;
        address: {
            line?: string;
            city?: {
                name?: string;
                state?: {
                    name?: string;
                    country: {
                        name: string;
                    };
                };
            };
            pinCode: string;
        } | null;
        customerCategory: CUSTOMER_CATEGORY;
    };
}

export const generateLabel = async (
    order: LabelOrder,
    width = 338,
    height = 204,
    // Set dimensions to 338x204 at 96dpi (standard screen resolution)
) => {
    try {
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        // For 96dpi output explicitly
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        // Enable high quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Fill background with white (for 32-bit color depth)
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        // Border around entire label
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        const orderId = order?.id.toString().padStart(5, "0");
        const customerId = order?.customerId?.toString().padStart(4, "0");
        const orderRef = `${orderId}/${order?.jobId}`;

        // Constants for calculating positions - adjusted for smaller size
        const rowHeights = [55, 25, 25, 25, 25, 25]; // Heights of each row - scaled down

        // First row: Left side number and right side barcode
        let currentY = 0;

        // First row (order ref and barcode)
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(0, currentY + rowHeights[0]);
        ctx.lineTo(width, currentY + rowHeights[0]);
        ctx.lineTo(width, currentY);
        ctx.lineTo(0, currentY);
        ctx.stroke();

        // Vertical divider in first row
        const firstColumnWidth = width / 3;
        ctx.beginPath();
        ctx.moveTo(firstColumnWidth, 0);
        ctx.lineTo(firstColumnWidth, rowHeights[0]);
        ctx.stroke();

        // Draw order reference and ID in first cell - smaller font
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "left";
        ctx.fillText(orderRef, 10, 25);
        ctx.fillText("00000", 10, 45);

        // Create a temporary canvas for the barcode
        const barcodeCanvas = document.createElement("canvas");
        // Set appropriate size for barcode
        barcodeCanvas.width = width - firstColumnWidth - 20;
        barcodeCanvas.height = 40;

        // Generate barcode using JSBarcode
        JsBarcode(barcodeCanvas, orderId, {
            format: "CODE128",
            width: 2, // Reduced for proper fit
            height: 40,
            displayValue: false,
            margin: 5,
            background: "#ffffff",
            lineColor: "#000000",
        });

        // Draw barcode on main canvas
        ctx.drawImage(barcodeCanvas, firstColumnWidth + 14, 4);

        // Second row with product details
        currentY += rowHeights[0];
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(0, currentY + rowHeights[1]);
        ctx.lineTo(width, currentY + rowHeights[1]);
        ctx.lineTo(width, currentY);
        ctx.lineTo(0, currentY);
        ctx.stroke();

        // Vertical divider in second row
        const secondRowDividerPos = width / 3;
        ctx.beginPath();
        ctx.moveTo(secondRowDividerPos, currentY);
        ctx.lineTo(secondRowDividerPos, currentY + rowHeights[1]);
        ctx.stroke();

        // Product number and specs - smaller font
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";

        // Extract product code and description
        ctx.fillText(orderId, 10, currentY + 18);

        // Product specifications in second column
        const productSpecs = `${order?.productItem?.product?.name} - ${order?.productItem?.sku}`;
        ctx.fillText(productSpecs, secondRowDividerPos + 10, currentY + 18);

        // Third row - Order By information
        currentY += rowHeights[1];
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(0, currentY + rowHeights[2]);
        ctx.lineTo(width, currentY + rowHeights[2]);
        ctx.lineTo(width, currentY);
        ctx.lineTo(0, currentY);
        ctx.stroke();

        // Format: Ord By -M-orderId (CITY - orderId)
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = "red";
        const city = order.customer?.address?.city?.name;
        const ordByText = `Ord By - ${customerId} (${city} - ${order?.customer?.address?.city?.state?.name})`;
        ctx.fillText(ordByText, 10, currentY + 18);

        // Fourth row - Customer address
        currentY += rowHeights[2];
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(0, currentY + rowHeights[3]);
        ctx.lineTo(width, currentY + rowHeights[3]);
        ctx.lineTo(width, currentY);
        ctx.lineTo(0, currentY);
        ctx.stroke();

        // Format customer address line - in red text like the reference image
        const businessName = order.customer?.businessName;
        const addressLine = order.customer?.address?.line;
        const pinCode = order.customer?.address?.pinCode;

        // Format address like in the reference image
        const fullAddress = `${businessName}${businessName ? ", " : ""}${addressLine}, ${pinCode}`;
        ctx.fillText(fullAddress, 10, currentY + 18);

        // Fifth row - Product details
        currentY += rowHeights[3];
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(0, currentY + rowHeights[4]);
        ctx.lineTo(width, currentY + rowHeights[4]);
        ctx.lineTo(width, currentY);
        ctx.lineTo(0, currentY);
        ctx.stroke();

        // Product quantity and code
        const productDetails = `${order.qty} ${productSpecs}`;
        ctx.fillText(productDetails, 10, currentY + 18);

        // Sixth row - Date and status
        currentY += rowHeights[4];
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(0, currentY + rowHeights[5]);
        ctx.lineTo(width, currentY + rowHeights[5]);
        ctx.lineTo(width, currentY);
        ctx.lineTo(0, currentY);
        ctx.stroke();

        // Vertical dividers in last row
        const dateColumnEnd = width - 70;
        const statusColumnEnd = width - 35;

        ctx.beginPath();
        ctx.moveTo(dateColumnEnd, currentY);
        ctx.lineTo(dateColumnEnd, currentY + rowHeights[5]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(statusColumnEnd, currentY);
        ctx.lineTo(statusColumnEnd, currentY + rowHeights[5]);
        ctx.stroke();

        // Format date
        const orderDate = new Date(order.createdAt).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            },
        );

        const orderTime = new Date(order.createdAt).toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
            },
        );

        // Smaller font for date time
        ctx.font = "bold 10px Arial";
        ctx.fillText(
            `Order Date & Time - ${orderDate} ${orderTime}`,
            5,
            currentY + 18,
        );

        // DD-Y in the middle-right section
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "DD-Y",
            (dateColumnEnd + statusColumnEnd) / 2,
            currentY + 18,
        );

        // X in the rightmost cell
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("X", (statusColumnEnd + width) / 2, currentY + 18);

        // Convert canvas to PNG data URL and trigger download
        return canvas.toDataURL("image/png");
    } catch (error) {
        console.error("Error generating PNG label:", error);
        throw error;
    }
};

export const generateLabelWithAttachment = async (
    order: LabelOrder,
    file: File,
) => {
    try {
        const firstImage = await convertFileToBase64(file);
        const secondImage = await generateLabel(order);
        const newLabel = await joinImages(firstImage, secondImage);
        download(newLabel, order.id);
    } catch (error) {
        console.error("Error generating combined label:", error);
        throw error;
    }
};

export function download(labelDataUrl: string, orderId: number): void {
    const link = document.createElement("a");
    link.href = labelDataUrl;
    link.download = `Label_${orderId}_${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
}
