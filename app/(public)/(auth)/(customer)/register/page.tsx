import { CustomerRegisterForm } from "@/components/admin/customer/form/customer-add-form";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4 py-10 pt-20 bg-gray-50">
            <div className="mx-auto container max-w-3xl space-y-6 p-6 bg-card">
                {/* <div className="space-y-2 text-center border-b-2"> */}
                <h1 className="text-3xl text-center font-bold text-muted-foreground pb-2">
                    Apply for &quot;Print Press&quot; membership account
                </h1>
                {/* </div> */}
            </div>
            <div className="mx-auto container max-w-3xl space-y-6 p-6 bg-card rounded-lg shadow-lg">
                <p className="text-muted-foreground text-center">
                    Enter your details to get started
                </p>
                <CustomerRegisterForm />
                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
