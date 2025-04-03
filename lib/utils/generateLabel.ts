import qrcode from "qrcode";
import { order, product, productItem } from "@prisma/client";

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
    };
}

export const generateLabel = async (order: LabelOrder) => {
    try {
        // Create a canvas element for drawing the label
        const canvas = document.createElement("canvas");
        const width = 800; // Width in pixels
        const height = 1200; // Height in pixels
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        // Fill background with white
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        // Draw border
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        // Set up fonts
        const titleFont = "48px Arial bold";
        const subtitleFont = "32px Arial";
        const normalFont = "32px Arial";
        const smallFont = "24px Arial";
        const addressFont = "28px Arial";

        // Company header
        ctx.fillStyle = "black";
        ctx.font = titleFont;
        ctx.textAlign = "center";
        ctx.fillText("PRINTIFY", width / 2, 100);

        ctx.font = subtitleFont;
        ctx.fillText("Professional Printing Services", width / 2, 160);

        // Order details section
        ctx.textAlign = "left";
        ctx.font = normalFont;
        ctx.fillText(`ORDER #${order.id}`, 80, 240);

        // Order date
        const orderDate = new Date(order.createdAt).toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            },
        );
        ctx.font = smallFont;
        ctx.fillText(`Date: ${orderDate}`, 80, 300);

        // Product details
        ctx.fillText(`Product: ${order.productItem.product.name}`, 80, 360);
        ctx.fillText(`SKU: ${order.productItem.sku}`, 80, 410);
        ctx.fillText(`Quantity: ${order.qty}`, 80, 460);

        // Draw separator line
        ctx.beginPath();
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 2;
        ctx.moveTo(80, 500);
        ctx.lineTo(width - 80, 500);
        ctx.stroke();

        // Shipping information
        ctx.font = normalFont;
        ctx.fillStyle = "black";
        ctx.fillText("SHIP TO:", 80, 560);

        // Customer details - name in bold
        ctx.font = `bold ${addressFont}`;
        ctx.fillText(
            order.customer?.businessName || order.customer?.name || "Customer",
            80,
            620,
        );

        // Address details
        ctx.font = addressFont;
        const addressLine = order.customer?.address?.line || "";
        let cityState = "";
        if (order.customer?.address?.city?.name) {
            cityState += order.customer.address.city.name;
        }
        if (order.customer?.address?.city?.state?.name) {
            cityState += `, ${order.customer.address.city.state.name}`;
        }
        if (order.customer?.address?.pinCode) {
            cityState += ` ${order.customer.address.pinCode}`;
        }

        ctx.fillText(addressLine, 80, 670);
        ctx.fillText(cityState, 80, 720);
        ctx.fillText(
            order.customer?.address?.city?.state?.country?.name || "India",
            80,
            770,
        );
        ctx.fillText(`Phone: ${order.customer?.phone || "N/A"}`, 80, 820);

        // Generate QR code
        try {
            const qrCodeDataUrl = await qrcode.toDataURL(`ORDER:${order.id}`, {
                errorCorrectionLevel: "H",
                margin: 1,
                width: 200,
            });

            const qrImg = new Image();
            await new Promise((resolve, reject) => {
                qrImg.onload = resolve;
                qrImg.onerror = reject;
                qrImg.src = qrCodeDataUrl;
            });

            // Draw QR code on the right side
            ctx.drawImage(qrImg, width - 280, 560, 200, 200);
        } catch (error) {
            console.error("Error generating QR code:", error);
        }

        // Draw barcode (simplified visual representation)
        ctx.fillStyle = "black";
        const barcodeY = 880;
        const barWidths = [4, 8, 4, 12, 8, 4, 8, 4, 12, 8, 4, 8, 4];
        let currentX = 200;

        barWidths.forEach((width) => {
            ctx.fillRect(currentX, barcodeY, width * 3, 80);
            currentX += width * 3 + 12;
        });

        // Add order ID below barcode
        ctx.font = normalFont;
        ctx.textAlign = "center";
        ctx.fillText(`${order.id}`, width / 2, barcodeY + 120);

        // Footer text
        ctx.font = smallFont;
        ctx.fillText(
            "This is a shipping label generated by Printify",
            width / 2,
            height - 60,
        );

        // Convert canvas to PNG data URL and trigger download
        const pngDataUrl = canvas.toDataURL("image/png");
        const labelName = `Shipping_Label_${order.id}_${new Date().toISOString().slice(0, 10)}`;

        // Create download link
        const link = document.createElement("a");
        link.href = pngDataUrl;
        link.download = `${labelName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return pngDataUrl;
    } catch (error) {
        console.error("Error generating PNG label:", error);
        throw error;
    }
};
