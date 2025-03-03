import { prisma } from "@/lib/prisma";
import { staffFormSchema } from "@/schemas/staff.form.schema";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            session.user.staff?.role !== "ADMIN"
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;
        const staff = await prisma.staff.findUnique({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Staff not found",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            data: staff,
            message: "staff fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching staff.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            session.user.staff?.role !== "ADMIN"
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;

        const staff = await prisma.staff.findUnique({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Staff not found.",
            });
        }

        const body = await request.json();
        const validatedData = staffFormSchema.partial().parse(body);

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};
        if (validatedData?.name) updateData.name = validatedData.name;
        if (validatedData.email) updateData.email = validatedData.email;
        if (validatedData.phone) updateData.phone = validatedData.phone;
        if (validatedData.role) updateData.role = validatedData.role;
        if (validatedData.password)
            updateData.password = validatedData.password;

        // if (
        //     validatedData.line ||
        //     validatedData.pinCode ||
        //     validatedData.city ||
        //     validatedData.state ||
        //     validatedData.country
        // ) {
        //     updateData.address = {
        //         update: {},
        //     };

        //     if (validatedData.line)
        //         updateData.address.update.line = validatedData.line;
        //     if (validatedData.pinCode)
        //         updateData.address.update.pinCode = validatedData.pinCode;

        //     if (validatedData?.city) {
        //         updateData.address.update.city = {
        //             connect: { id: parseInt(validatedData.city) }, // Linking to an existing city
        //         };
        //     }

        //     if (validatedData?.state) {
        //         updateData.address.update.city = {
        //             update: {
        //                 state: {
        //                     connect: { id: parseInt(validatedData.state) }, // Linking to an existing state
        //                 },
        //             },
        //         };
        //     }

        //     if (validatedData?.country) {
        //         updateData.address.update.city = {
        //             update: {
        //                 state: {
        //                     update: {
        //                         country: {
        //                             connect: {
        //                                 id: parseInt(validatedData.country),
        //                             }, // Linking to an existing country
        //                         },
        //                     },
        //                 },
        //             },
        //         };
        //     }
        // }

        const upadatedStaff = await prisma.staff.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "staff updated successfully",
            data: upadatedStaff,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while updating staff.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            session.user.staff?.role !== "ADMIN"
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { id } = await params;

        const staff = await prisma.staff.delete({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Staff not found",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Staff deleted successfully.",
            data: null,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while deleting staff.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
