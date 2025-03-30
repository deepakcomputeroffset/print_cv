import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { order } from "@prisma/client";

interface InvoiceOrder extends order {
    productItem: {
        productId: number;
        sku: string;
        product: {
            name: string;
            description?: string;
        };
    };
    customer: {
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

export const generateInvoice = (order: InvoiceOrder) => {
    // Create PDF with A4 dimensions
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Add a light gray background for the header
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Company logo (left side)
    try {
        // This would be your actual logo path
        // const logoBase64 =
        // "data:image/png;base64,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";
        // doc.addImage(logoBase64, "PNG", margin, 10, 25, 15);
    } catch (error) {
        console.error("Error adding logo:", error);
    }

    // Company name
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PrintMasters", margin + 27, 17);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Printing Services", margin + 27, 22);

    // Tax Invoice title
    doc.setTextColor(0, 120, 210);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Invoice", 155, 17);

    // Company details (right aligned)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Official Mail: printmasters.info@gmail.com", 155, 25);
    doc.text("Support Number: +91 982-832-2293", 155, 30);
    doc.text("Website: www.printmasters.in", 155, 35);
    doc.text("Address: Plot No. 36 Karampura Industrial Area,", 155, 40);
    doc.text("22 Godam, Jaipur, Rajasthan 302019", 155, 45);

    // GST number (top left)
    doc.setFontSize(8);
    doc.text("GST: 08CBAPG4788J1ZJ", margin, 30);

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Customer section title
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("To:", margin, 60);
    doc.setFont("helvetica", "normal");

    // Customer details (left column)
    const customerName = order.customer.name || "Customer";
    doc.text(`Name: ${customerName}`, margin, 65);

    // Format address
    let addressText = "Address: ";
    if (order.customer?.address?.line) {
        addressText += order.customer.address.line;
    }

    let cityStateText = "";
    if (order.customer?.address?.city?.name) {
        cityStateText += order.customer.address.city.name;
    }
    if (order.customer?.address?.city?.state?.name) {
        cityStateText += `, ${order.customer.address.city.state.name}`;
    }
    if (order.customer?.address?.pinCode) {
        cityStateText += ` ${order.customer.address.pinCode}`;
    }
    if (order.customer?.address?.city?.state?.country?.name) {
        cityStateText += `, ${order.customer.address.city.state.country.name}`;
    }

    doc.text(addressText, margin, 70);
    if (addressText.length > 40) {
        doc.text(cityStateText, margin, 80);
        // Shift down subsequent elements if address is long
        doc.text(`Phone: ${order.customer.phone || "N/A"}`, margin, 85);
        doc.text(`Email: ${order.customer.businessName || "N/A"}`, margin, 90);
        doc.text(`GST Number: 06ERMPC2261Q1Z0`, margin, 95);
        doc.text(`Member Id: ${order.id}`, margin, 100);
    } else {
        doc.text(cityStateText, margin, 75);
        doc.text(`Phone: ${order.customer.phone || "N/A"}`, margin, 80);
        doc.text(`Email: ${order.customer.businessName || "N/A"}`, margin, 85);
        doc.text(`GST Number: 06ERMPC2261Q1Z0`, margin, 90);
        doc.text(`Member Id: ${order.id}`, margin, 95);
    }

    // Invoice info (right column)
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Info:", 115, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Number: ${order.id}`, 115, 65);

    // Generate verification code
    const verificationCode = `${order.id}${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`;
    doc.text(`Order Verification Code:`, 115, 70);
    doc.text(`${verificationCode.substring(0, 20)}`, 115, 75);
    doc.text(`${verificationCode.substring(20, 40)}`, 115, 80);

    // Invoice date
    const invoiceDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    doc.text(`Invoice Date: ${invoiceDate}`, 115, 85);

    // Shipping method
    doc.text("Shipping Method", 115, 95);
    doc.text("Transport shipping", 115, 100);

    // QR Code (right side)
    try {
        const qrCode = createQRCode(
            `ORDER:${order.id}|VERIFY:${verificationCode}`,
        );
        doc.addImage(qrCode, "PNG", 150, 60, 35, 35);
    } catch (error) {
        console.error("Error generating QR code:", error);
        // Draw placeholder for QR code
        doc.setDrawColor(200, 200, 200);
        doc.rect(150, 60, 35, 35);
        doc.setFontSize(8);
        doc.text("QR Code", 158, 80);
    }

    // Order table (starting below customer and invoice info)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    // Items table
    autoTable(doc, {
        startY: 110,
        head: [
            ["S.No.", "Order Id", "Quantity", "Description of Goods", "Cost"],
        ],
        body: [
            [
                "1",
                `#${order.id}`,
                order.qty.toString(),
                `Product Name: Matte + UV\nPrinting: Single Side Printing + Single Side UV`,
                `${order.total.toFixed(2)}-`,
            ],
        ],
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 15 },
            1: { halign: "center", cellWidth: 25 },
            2: { halign: "center", cellWidth: 25 },
            3: { fontStyle: "normal", cellWidth: "auto" },
            4: { halign: "right", cellWidth: 25 },
        },
    });

    // Tax summary rows
    const taxAmount = order?.total * 0.18; // 18% tax
    const shippingCost = 0;
    const totalAmount = order?.total + taxAmount + shippingCost;

    // eslint-disable-next-line
    const tableEndY = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
        startY: tableEndY,
        body: [
            ["", "", "", "Total Tax", `${taxAmount.toFixed(2)}-`],
            ["", "", "", "Shipping Charges", `${shippingCost.toFixed(2)}-`],
            ["", "", "", "Total Amount", `${totalAmount.toFixed(2)}-`],
        ],
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { fontStyle: "bold", cellWidth: "auto" },
            4: { halign: "right", fontStyle: "bold", cellWidth: 25 },
        },
    });

    // Bank details and Terms & Conditions side by side
    // eslint-disable-next-line
    const detailsY = (doc as any).lastAutoTable.finalY + 10;

    // Bank Details (left side)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details", margin, detailsY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Bank Name: Union Bank Of India", margin, detailsY + 7);
    doc.text(
        "Branch Address: Plot No-8, Vivek Vihar, New Sanganer Road, Pt-Shyam Nagar, Jaipur",
        margin,
        detailsY + 14,
    );
    doc.text("Account Name: Prestige Printing Press", margin, detailsY + 21);
    doc.text("Account Number: 510101007070716", margin, detailsY + 28);
    doc.text("IFSC Code: UBIN0575607", margin, detailsY + 35);
    doc.text("SWIFT Code: UBININBBJP", margin, detailsY + 42);

    // Terms and Conditions (right side)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions", pageWidth / 2 + 5, detailsY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
        "1. Goods once sold will not be taken back.",
        pageWidth / 2 + 5,
        detailsY + 7,
    );
    doc.text(
        "2. Warranty as per manufacturer's policy.",
        pageWidth / 2 + 5,
        detailsY + 14,
    );
    doc.text("3. Subject to Jurisdiction.", pageWidth / 2 + 5, detailsY + 21);

    // Certification text (center aligned)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
        "Certified that particulars given above are true and correct. This is a computer generated invoice.",
        pageWidth / 2,
        detailsY + 55,
        { align: "center" },
    );

    // Print date
    const printDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    doc.text(`Printed on ${printDate}`, pageWidth / 2, detailsY + 62, {
        align: "center",
    });

    // Save the PDF with a proper name
    const invoiceNumber = `Tax_Invoice_${order.id}_${new Date().toISOString().slice(0, 10)}`;
    doc.save(`${invoiceNumber}.pdf`);
};

// Function to create a QR code placeholder (in a real app, you'd use a QR code library)
function createQRCode(data: string): string {
    // This is just a placeholder base64 string for a QR code
    console.log(data);
    // In a real app, you would use a QR code library to generate this dynamically
    return "data:image/png;base64,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";
}
