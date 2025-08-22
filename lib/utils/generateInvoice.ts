import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { order, pricing, product, productItem } from "@prisma/client";
import qrcode from "qrcode";
import { IGST_TAX_IN_PERCENTAGE } from "../constants";
import { addressType } from "@/types/types";

interface InvoiceOrder extends order {
    productItem: productItem & {
        pricing: pricing[];
        product: product;
    };
    customer: {
        address?: addressType;
        businessName: string;
        name: string;
        phone: string;
    };
}

export const generateInvoice = async (order: InvoiceOrder) => {
    // Create PDF with A4 dimensions
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const rightMargin = pageWidth - margin;

    // Add white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add a thin blue line at the top
    doc.setFillColor(41, 98, 255);
    doc.rect(0, 0, pageWidth, 2, "F");

    // HEADER SECTION - Left side
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Printify", margin, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Printing Services", margin, 20);

    // GST number in a styled box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, 22, 70, 8, 1, 1, "F");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text("GST: 08CBAPG4788J1ZJ", margin + 2, 27);

    // HEADER SECTION - Right side, TAX INVOICE better positioned
    doc.setTextColor(41, 98, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    // Calculate text width to ensure it stays within the margin
    const textWidth = doc.getTextWidth("TAX INVOICE");
    const taxInvoiceX = rightMargin - textWidth - 5; // 5mm buffer from right margin
    doc.text("TAX INVOICE", taxInvoiceX, 15);

    // Company details (right aligned)
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    // Right-aligned company details
    const companyDetails = [
        "Official Mail: printmasters.info@gmail.com",
        "Support Number: +91 982-832-2293",
        "Website: www.printmasters.in",
        "Address: Plot No. 36 Karampura Industrial Area,",
        "22 Godam, Jaipur, Rajasthan 302019",
    ];

    companyDetails.forEach((line, index) => {
        doc.text(line, rightMargin, 20 + index * 4, { align: "right" });
    });

    // Horizontal line after header with increased spacing
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 40, rightMargin, 40);

    // CUSTOMER & INVOICE DETAILS SECTION with increased distance from header line
    const columnWidth = (pageWidth - margin * 2) / 2 - 5;

    // Left box for customer details
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, 50, columnWidth, 50, 2, 2, "F");

    // Customer section title
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 98, 255);
    doc.text("BILL TO:", margin + 5, 57);

    // Customer details
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const customerName = order?.customer?.name || "Customer";
    doc.text(`Name: ${customerName}`, margin + 5, 65);

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

    // Account for long addresses by wrapping text
    if (addressText.length > 30) {
        const splitAddress = doc.splitTextToSize(addressText, columnWidth - 10);
        doc.text(splitAddress, margin + 5, 70);

        // Position city/state text based on address length
        const cityStateY = 70 + splitAddress.length * 5;
        doc.text(cityStateText, margin + 5, cityStateY);

        // Position remaining details
        doc.text(
            `Phone: ${order?.customer?.phone || "N/A"}`,
            margin + 5,
            cityStateY + 6,
        );
        doc.text(
            `Email: ${order?.customer?.businessName || "N/A"}`,
            margin + 5,
            cityStateY + 12,
        );
        doc.text(`GST: 06ERMPC2261Q1Z0`, margin + 5, cityStateY + 18);
    } else {
        doc.text(addressText, margin + 5, 70);
        doc.text(cityStateText, margin + 5, 76);
        doc.text(`Phone: ${order?.customer?.phone || "N/A"}`, margin + 5, 82);
        doc.text(
            `Email: ${order?.customer?.businessName || "N/A"}`,
            margin + 5,
            88,
        );
        doc.text(`GST: 06ERMPC2261Q1Z0`, margin + 5, 94);
    }

    // Right box for invoice details
    const rightColumnX = margin + columnWidth + 10;
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(rightColumnX, 50, columnWidth, 50, 2, 2, "F");

    // Invoice info title
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 98, 255);
    doc.text("INVOICE DETAILS:", rightColumnX + 5, 57);

    // Invoice details
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Number: #${order.id}`, rightColumnX + 5, 65);

    // Generate verification code
    const verificationCode = `${order.id}${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`;
    doc.text(
        `Verification Code: ${verificationCode.substring(0, 20)}`,
        rightColumnX + 5,
        72,
    );

    // Invoice date
    const invoiceDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    doc.text(`Invoice Date: ${invoiceDate}`, rightColumnX + 5, 79);

    // Payment terms
    doc.text(`Payment Terms: On Delivery`, rightColumnX + 5, 86);
    doc.text(`Shipping Method: Transport`, rightColumnX + 5, 93);

    // QR Code section - Using a reliable approach that works with jsPDF
    try {
        // Use a reliable QR code image data
        const url = await qrcode.toDataURL(
            `ORDER:${order.id}|VERIFY:${verificationCode}`,
        );

        // Add QR code to PDF
        doc.addImage(url, "PNG", rightColumnX + columnWidth - 30, 53, 25, 25);
    } catch (error) {
        console.error("Error generating QR code:", error);
        // Draw placeholder for QR code
        doc.setDrawColor(200, 200, 200);
        doc.rect(rightColumnX + columnWidth - 30, 53, 25, 25);
        doc.setFontSize(8);
        doc.text("QR Code", rightColumnX + columnWidth - 22, 68);
    }

    // ITEMS TABLE - Fix product details spacing
    const findPrice = () => {
        const isTieredPricing = order.productItem.product?.isTieredPricing;
        if (isTieredPricing)
            return order?.productItem?.pricing?.find(
                (v) => v.qty === order.qty,
            );
        return order?.productItem?.pricing?.[0];
    };
    autoTable(doc, {
        startY: 110,
        head: [
            ["S. No.", "Product Details", "Quantity", "Unit Price", "Amount"],
        ],
        body: [
            [
                "1",
                // Format product details with SKU in parentheses
                {
                    content: `${order.productItem.product.name} (${order.productItem.sku})`,
                    styles: { cellWidth: "auto", minCellWidth: 70 },
                },
                order.qty.toString(),
                `Rs. ${(order.price / (order.qty / (findPrice()?.qty ?? 0))).toFixed(2)}`,
                `Rs. ${(order.price || 0).toFixed(2)}`,
            ],
        ],
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 5,
            lineColor: [220, 220, 220],
            overflow: "linebreak",
        },
        headStyles: {
            fillColor: [41, 98, 255],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 20 },
            1: { fontStyle: "normal", cellWidth: "auto", halign: "left" },
            2: { halign: "center", cellWidth: 25 },
            3: { halign: "right", cellWidth: 30 },
            4: { halign: "right", cellWidth: 30 },
        },
        didParseCell: function (data) {
            if (data.section === "body" && data.column.index === 1) {
                data.cell.styles.minCellHeight = 20;
            }
        },
    });

    // Calculate tax breakdown with IGST instead of CGST/SGST

    const subtotal = order?.price;
    const igst = subtotal * IGST_TAX_IN_PERCENTAGE;
    const uploadCharge = order?.uploadCharge;
    const totalAmount = subtotal + igst + uploadCharge;
    const shippingCost = 0;

    // eslint-disable-next-line
    const tableEndY = (doc as any).lastAutoTable.finalY;

    // TAX BREAKDOWN TABLE with IGST
    autoTable(doc, {
        startY: tableEndY + 5,
        body: [
            ["", "", "", "Subtotal", `Rs. ${subtotal.toFixed(2)}`],
            ["", "", "", "IGST (18%)", `Rs. ${igst.toFixed(2)}`],
            ["", "", "", "CGST (0%)", "Rs. 0.00"],
            ["", "", "", "SGST (0%)", "Rs. 0.00"],
            ["", "", "", "Shipping Charges", `Rs. ${shippingCost.toFixed(2)}`],
            ["", "", "", "Upload Charges", `Rs. ${uploadCharge.toFixed(2)}`],
            ["", "", "", "Total Amount", `Rs. ${totalAmount.toFixed(2)}`],
        ],
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 5,
            lineColor: [220, 220, 220],
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: "auto" },
            2: { cellWidth: 25 },
            3: { fontStyle: "bold", cellWidth: 60 },
            4: { halign: "right", fontStyle: "bold", cellWidth: 30 },
        },
        alternateRowStyles: {
            fillColor: [248, 249, 250],
        },
    });

    // Amount in words
    // eslint-disable-next-line
    const taxTableEndY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Amount in words:", margin, taxTableEndY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(
        `Rupees ${numberToWords(totalAmount)} only`,
        margin + 30,
        taxTableEndY + 15,
    );

    // BANK DETAILS & TERMS CONDITIONS SECTION with increased spacing
    // const detailsY = taxTableEndY + 30;
    // const boxHeight = 55;

    // Bank Details (left side) in a box with fixed width
    // doc.setFillColor(248, 249, 250);
    // doc.roundedRect(margin, detailsY, columnWidth, boxHeight, 2, 2, "F");

    // doc.setFontSize(11);
    // doc.setFont("helvetica", "bold");
    // doc.setTextColor(41, 98, 255);
    // doc.text("BANK DETAILS", margin + 5, detailsY + 8);

    // doc.setTextColor(80, 80, 80);
    // doc.setFontSize(9);
    // doc.setFont("helvetica", "normal");

    // Break bank details into smaller lines to avoid overlap
    // doc.text("Bank Name: Union Bank Of India", margin + 5, detailsY + 16);
    // doc.text(
    //     "Branch Address: Plot No-8, Vivek Vihar,",
    //     margin + 5,
    //     detailsY + 24,
    // );
    // doc.text(
    //     "New Sanganer Road, Pt-Shyam Nagar, Jaipur",
    //     margin + 5,
    //     detailsY + 32,
    // );
    // doc.text(
    //     "Account Name: Prestige Printing Press",
    //     margin + 5,
    //     detailsY + 40,
    // );
    // doc.text("Account Number: 510101007070716", margin + 5, detailsY + 48);

    // Terms and Conditions (right side) in a box
    // doc.setFillColor(248, 249, 250);
    // doc.roundedRect(rightColumnX, detailsY, columnWidth, boxHeight, 2, 2, "F");

    // doc.setFontSize(11);
    // doc.setFont("helvetica", "bold");
    // doc.setTextColor(41, 98, 255);
    // doc.text("TERMS AND CONDITIONS", rightColumnX + 5, detailsY + 8);

    // doc.setTextColor(80, 80, 80);
    // doc.setFontSize(9);
    // doc.setFont("helvetica", "normal");

    // doc.text(
    //     "1. Goods once sold will not be taken back.",
    //     rightColumnX + 5,
    //     detailsY + 16,
    // );
    // doc.text(
    //     "2. Warranty as per manufacturer's policy.",
    //     rightColumnX + 5,
    //     detailsY + 24,
    // );
    // doc.text("3. Subject to Jurisdiction.", rightColumnX + 5, detailsY + 32);
    // doc.text(
    //     "4. Payment to be made within 30 days.",
    //     rightColumnX + 5,
    //     detailsY + 40,
    // );
    // doc.text("5. E. & O.E.", rightColumnX + 5, detailsY + 48);

    // FOOTER SECTION
    // const footerY = detailsY + boxHeight + 20;

    // Signature line on right side
    // doc.setDrawColor(180, 180, 180);
    // doc.line(
    //     rightColumnX + 20,
    //     footerY,
    //     rightColumnX + columnWidth - 5,
    //     footerY,
    // );
    // doc.setFontSize(9);
    // doc.setTextColor(80, 80, 80);
    // doc.text(
    //     "Authorized Signatory",
    //     rightColumnX + columnWidth - 40,
    //     footerY + 6,
    // );

    // Certification text (center aligned) with increased bottom margin
    // doc.setFontSize(8);
    // doc.setFont("helvetica", "italic");
    // doc.setTextColor(120, 120, 120);
    // doc.text(
    //     "Certified that particulars given above are true and correct. This is a computer generated invoice.",
    //     pageWidth / 2,
    //     footerY + 25,
    //     { align: "center" },
    // );

    // Print date with increased bottom margin
    // const printDate = new Date().toLocaleDateString("en-US", {
    //     day: "2-digit",
    //     month: "long",
    //     year: "numeric",
    // });
    // doc.text(`Generated on ${printDate}`, pageWidth / 2, footerY + 35, {
    //     align: "center",
    // });

    // Save the PDF with a proper name
    const invoiceNumber = `Tax_Invoice_${order.id}_${new Date().toISOString().slice(0, 10)}`;
    doc.save(`${invoiceNumber}.pdf`);
};

// Helper function to convert number to words (for amount in words)
function numberToWords(amount: number): string {
    const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];

    const numToWords = (num: number): string => {
        if (num < 20) return ones[num];
        if (num < 100)
            return (
                tens[Math.floor(num / 10)] +
                (num % 10 ? " " + ones[num % 10] : "")
            );
        if (num < 1000)
            return (
                ones[Math.floor(num / 100)] +
                " Hundred" +
                (num % 100 ? " and " + numToWords(num % 100) : "")
            );
        if (num < 100000)
            return (
                numToWords(Math.floor(num / 1000)) +
                " Thousand" +
                (num % 1000 ? " " + numToWords(num % 1000) : "")
            );
        if (num < 10000000)
            return (
                numToWords(Math.floor(num / 100000)) +
                " Lakh" +
                (num % 100000 ? " " + numToWords(num % 100000) : "")
            );
        return (
            numToWords(Math.floor(num / 10000000)) +
            " Crore" +
            (num % 10000000 ? " " + numToWords(num % 10000000) : "")
        );
    };

    const wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - wholePart) * 100);

    let result = numToWords(wholePart);
    if (decimalPart > 0) {
        result += " and " + numToWords(decimalPart) + " Paise";
    }

    return result;
}
