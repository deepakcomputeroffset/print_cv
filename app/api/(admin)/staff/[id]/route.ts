import { Prisma } from "@/lib/prisma";
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
        const staff = await Prisma.staff.findUnique({
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

        const staff = await Prisma.staff.findUnique({
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
        console.log(body);
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

        // Handle address updates
        if (validatedData.line || validatedData.pinCode || validatedData.city) {
            // Convert address schema fields to database format
            const addressData: Record<string, string | number> = {};

            if (validatedData.line) addressData.line = validatedData.line;
            if (validatedData.pinCode)
                addressData.pinCode = validatedData.pinCode;
            if (validatedData.city)
                addressData.cityId = parseInt(validatedData.city);

            // Find existing customer address
            const existingAddress = await Prisma.address.findFirst({
                where: {
                    ownerId: staff.id,
                    ownerType: "STAFF",
                },
            });
            console.log(validatedData);
            if (existingAddress) {
                // Update existing address
                console.log("updating");
                await Prisma.address.update({
                    where: { id: existingAddress.id },
                    data: addressData,
                });
            } else {
                console.log("creating");
                console.log(addressData);
                if (
                    addressData?.cityId &&
                    addressData?.line &&
                    addressData?.pinCode
                ) {
                    console.log("inside creating");
                    await Prisma.address.create({
                        data: {
                            ownerId: staff.id,
                            ownerType: "STAFF",
                            cityId: Number(addressData?.cityId),
                            line: addressData.line as string,
                            pinCode: addressData?.pinCode as string,
                        },
                    });
                }
            }
        }
        const upadatedStaff = await Prisma.staff.update({
            where: { id: parseInt(id) },
            data: updateData,
            omit: {
                password: true,
            },
        });

        const staffAddress = await Prisma.address.findFirst({
            where: {
                ownerId: staff?.id,
                ownerType: "STAFF",
            },
        });

        // Transform to maintain response format
        const staffWithAddress = {
            ...upadatedStaff,
            address: staffAddress,
        };

        return serverResponse({
            status: 200,
            success: true,
            message: "staff updated successfully",
            data: staffWithAddress,
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

        const staff = await Prisma.staff.delete({
            where: { id: parseInt(id) },
        });

        const address = await Prisma.address.findFirst({
            where: {
                ownerId: staff.id,
                ownerType: "STAFF",
            },
        });

        await Prisma.address.delete({
            where: {
                id: address?.id,
            },
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
