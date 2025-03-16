import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "./compnents/changePasswordForm";

export default function CustomerChangePasswordPage() {
    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    );
}
