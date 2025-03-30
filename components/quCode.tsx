"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function UpiQrCode() {
    const [amount, setAmount] = useState("");
    const [showQr, setShowQr] = useState(false);
    const isValidAmount = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

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
                            <div className="p-4 bg-white rounded-lg">
                                <QRCode
                                    size={256}
                                    value={`upi://pay?pa=7479796212@upi&pn=AdityaKumar&am=${parseFloat(amount)}`}
                                    className="w-64 h-64"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Amount: ₹{parseFloat(amount).toFixed(2)}
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
