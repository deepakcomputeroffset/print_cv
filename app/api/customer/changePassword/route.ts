import { auth } from "@/lib/auth";
import { generateHash, verifyHash } from "@/lib/hash";
import serverResponse from "@/lib/serverResponse";
import { changePasswordFormSchema } from "@/schemas/customer.form.schema";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return serverResponse({
                status: 401,
                message: "Unauthorized",
                success: false,
            });
        }

        const data = await request.json();
        const result = changePasswordFormSchema.safeParse(data);
        if (!result.success) {
            return serverResponse({
                status: 400,
                message: result.error.message,
                success: false,
            });
        }

        const { oldPassword, password } = result.data;

        const customer = await prisma?.customer.findUnique({
            where: {
                id: session.user.customer?.id,
            },
        });

        const isPasswordCorrect = await verifyHash(
            oldPassword,
            customer?.password as string,
        );

        if (!isPasswordCorrect) {
            return serverResponse({
                status: 400,
                message: "Old password is incorrect",
                success: false,
            });
        }

        const hashedPassword = await generateHash(password);

        await prisma?.customer.update({
            where: {
                id: session.user.customer?.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Password updated",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : error,
        });
    }
}
