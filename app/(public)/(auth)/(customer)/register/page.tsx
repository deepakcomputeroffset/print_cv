import { CustomerRegisterForm } from "@/components/admin/customer/form/customer-add-form";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4 py-10 pt-20 bg-gray-100">
            <div className="mx-auto container max-w-3xl space-y-6 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl text-center font-bold text-[#660A27] pb-2">
                    Apply for &quot;Print Press&quot; Membership Account
                </h1>
            </div>
            <div className="mx-auto container max-w-3xl space-y-6 p-6 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-center">
                    Enter your details to get started
                </p>
                <CustomerRegisterForm />
                <div className="text-center text-sm">
                    <p className="text-sm text-gray-600 mt-3">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-[#A6192E] font-semibold"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
