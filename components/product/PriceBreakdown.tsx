import { NUMBER_PRECISION } from "@/lib/constants";

interface PriceBreakdownProps {
    basePrice: number;
    uploadCharge: number;
    igstAmount: number;
    totalAmount: number;
}

export default function PriceBreakdown({
    basePrice,
    uploadCharge,
    igstAmount,
    totalAmount,
}: PriceBreakdownProps) {
    return (
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between items-center text-slate-600">
                <span>Cost</span>
                <span className="font-medium text-slate-800">
                    ₹{(basePrice + uploadCharge).toFixed(NUMBER_PRECISION)}
                </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
                <span>IGST (18%)</span>
                <span className="font-medium text-slate-800">
                    ₹{igstAmount.toFixed(NUMBER_PRECISION)}
                </span>
            </div>

            <div className="border-t border-slate-200 my-1"></div>

            <div className="flex justify-between items-center text-slate-900 font-bold text-base">
                <span>Amount Payable</span>
                <span>₹{totalAmount.toFixed(NUMBER_PRECISION)}</span>
            </div>
        </div>
    );
}
