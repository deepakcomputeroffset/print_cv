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
    // Create PDF with bill dimensions (80mm × 210mm - typical receipt size)
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 210],
    });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 5;
    let yPos = 10;

    // Company brand
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("PRINTING PRESS", pageWidth / 2, yPos, { align: "center" });

    yPos += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Printing Services", pageWidth / 2, yPos, {
        align: "center",
    });

    yPos += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", pageWidth / 2, yPos, { align: "center" });

    // Order details
    yPos += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    // Left side - Order info
    doc.text(
        [
            `Order #: ${order.id}`,
            `Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
            `Invoice Date: ${new Date().toLocaleDateString("en-IN")}`,
            `Payment Mode: Prepaid`,
        ],
        margin,
        yPos,
    );

    // Shipping details
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.text("SHIPPING ADDRESS:", margin, yPos);

    yPos += 5;
    doc.setFont("helvetica", "normal");
    const addressParts = [
        order.customer.businessName,
        order.customer.name,
        order.customer.phone,
        order.customer?.address?.line || "",
    ];

    // Handle optional address parts safely
    if (order.customer?.address?.city?.name) {
        const cityPart = order.customer.address.city.name;

        const statePart = order.customer.address.city.state?.name || "";

        addressParts.push(
            `${cityPart}${statePart ? ", " + statePart : ""} ${order.customer.address.pinCode || ""}`,
        );

        // Add country if available
        const countryName = order.customer.address.city.state?.country?.name;
        if (countryName) {
            addressParts.push(countryName);
        }
    }

    // Filter out empty parts
    const filteredAddress = addressParts.filter(
        (part) => part.trim() !== "" && part.trim() !== ",",
    );
    doc.text(filteredAddress, margin, yPos);

    // Item details title
    yPos += 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("ITEM DETAILS", margin, yPos);

    // Item table
    yPos += 7;
    autoTable(doc, {
        startY: yPos,
        margin: { left: margin, right: margin },
        head: [["Item", "SKU", "Qty", "Price", "Total"]],
        body: [
            [
                order.productItem.product.name,
                order.productItem.sku,
                order.qty.toString(),
                `Rs. ${(order.amount / order.qty).toFixed(2)}`,
                `Rs. ${order.amount.toFixed(2)}`,
            ],
        ],
        theme: "plain",
        styles: {
            fontSize: 7,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: "bold",
        },
    });

    // Update yPos after table
    // eslint-disable-next-line
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Payment summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PAYMENT SUMMARY", margin, yPos);

    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 5;

    // Price breakdown
    const subtotal = order.amount;
    const tax = subtotal * 0.18; // Assuming 18% GST
    const total = subtotal + tax;

    const priceTable = [
        ["Subtotal:", `Rs. ${subtotal.toFixed(2)}`],
        ["CGST (9%):", `Rs. ${(tax / 2).toFixed(2)}`],
        ["SGST (9%):", `Rs. ${(tax / 2).toFixed(2)}`],
        ["Total:", `Rs. ${total.toFixed(2)}`],
    ];

    autoTable(doc, {
        startY: yPos,
        margin: { left: margin, right: margin },
        body: priceTable,
        theme: "plain",
        styles: {
            fontSize: 7,
            cellPadding: 1,
        },
        columnStyles: {
            0: { fontStyle: "normal", halign: "left" },
            1: { fontStyle: "bold", halign: "right" },
        },
    });

    // Update yPos after table
    // eslint-disable-next-line
    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Amount in words
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.text(
        `Amount in words: Rupees ${numberToWords(total)} only`,
        margin,
        yPos,
    );

    // Footer
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 5;
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(
        "This is a computer-generated invoice and does not require a signature.",
        pageWidth / 2,
        yPos,
        { align: "center" },
    );

    yPos += 3;
    doc.text(
        `Invoice generated on: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPos,
        { align: "center" },
    );

    yPos += 5;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for your business!", pageWidth / 2, yPos, {
        align: "center",
    });

    // Save the PDF with a proper name
    const invoiceNumber = `INV-${order.id}-${new Date().toISOString().slice(0, 10)}`;
    doc.save(`${invoiceNumber}.pdf`);
};

// Helper function to convert number to words (simplified for demo)
function numberToWords(num: number): string {
    const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];
    const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];

    if (num < 20) return ones[Math.floor(num)];

    if (num < 100) {
        return (
            tens[Math.floor(num / 10)] +
            (num % 10 !== 0 ? " " + ones[Math.floor(num % 10)] : "")
        );
    }

    if (num < 1000) {
        return (
            ones[Math.floor(num / 100)] +
            " hundred" +
            (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "")
        );
    }

    if (num < 100000) {
        return (
            numberToWords(Math.floor(num / 1000)) +
            " thousand" +
            (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
        );
    }

    if (num < 10000000) {
        return (
            numberToWords(Math.floor(num / 100000)) +
            " lakh" +
            (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
        );
    }

    return (
        numberToWords(Math.floor(num / 10000000)) +
        " crore" +
        (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
    );
}
