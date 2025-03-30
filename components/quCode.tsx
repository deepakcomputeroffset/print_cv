"use client";

import { useState, useEffect, useRef } from "react";
import qrcode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function UpiQrCode() {
    const [amount, setAmount] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [qrUrl, setQrUrl] = useState("");
    const isValidAmount = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (showQr && isValidAmount && canvasRef.current) {
            const upiString = `upi://pay?pa=7479796212@upi&pn=AdityaKumar&am=${parseFloat(amount)}`;

            // Generate QR code in canvas
            qrcode.toCanvas(
                canvasRef.current,
                upiString,
                {
                    width: 256,
                    margin: 1,
                    color: {
                        dark: "#000000",
                        light: "#ffffff",
                    },
                },
                (error) => {
                    if (error)
                        console.error("Error generating QR code:", error);
                },
            );

            // Also generate a data URL for download if needed
            qrcode.toDataURL(
                upiString,
                {
                    width: 256,
                    margin: 1,
                },
                (err, url) => {
                    if (err) {
                        console.error("Error generating QR code URL:", err);
                        return;
                    }
                    setQrUrl(url);
                },
            );
        }
    }, [showQr, amount, isValidAmount]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full space-y-6">
                {!showQr && (
                    <div className="space-y-2">
                        <Label htmlFor="amount">Enter Amount (₹)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="100"
                            step="0.01"
                        />
                        {!isValidAmount && amount !== "" && (
                            <p className="text-sm text-red-500">
                                Please enter a valid amount greater than 0
                            </p>
                        )}

                        <Button
                            onClick={() => setShowQr(!showQr)}
                            disabled={!isValidAmount}
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Generate QR Code
                        </Button>
                    </div>
                )}

                {showQr && isValidAmount && (
                    <Card className="p-6 relative">
                        <div className="flex flex-col items-center gap-4">
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() => {
                                    setShowQr(false);
                                    setAmount("");
                                }}
                                className="absolute top-2 right-2"
                            >
                                <X />
                            </Button>
                            <h2 className="text-lg font-semibold">
                                Scan QR Code to Pay
                            </h2>
                            <div className="p-4 bg-white rounded-lg flex items-center justify-center">
                                <canvas
                                    ref={canvasRef}
                                    className="w-64 h-64"
                                ></canvas>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Amount: ₹{parseFloat(amount).toFixed(2)}
                            </p>
                            <Button
                                onClick={() => {
                                    if (qrUrl) {
                                        const a = document.createElement("a");
                                        a.href = qrUrl;
                                        a.download = `payment-qr-${amount}.png`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                    }
                                }}
                                size="sm"
                                variant="outline"
                            >
                                Download QR Code
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
