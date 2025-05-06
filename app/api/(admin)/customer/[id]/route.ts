import { Prisma } from "@/lib/prisma";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { Prisma as PPrisma } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!session) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;
        const customer = await Prisma.customer.findUnique({
            where: { id: parseInt(id) },
            include: {
                customerCategory: true,
            },
        });
        const address = await Prisma.address.findFirst({
            where: {
                ownerId: customer?.id,
                ownerType: "CUSTOMER",
            },
            include: {
                city: {
                    include: {
                        state: true,
                    },
                },
            },
        });

        if (!customer) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer not found.",
            });
        }
        const customerWithAddress = { ...customer, address };
        return serverResponse({
            status: 200,
            success: true,
            data: customerWithAddress,
            message: "Customer fetech successfully.",
        });
    } catch (error) {
        console.error("Error fetching customer:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal error.",
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
            session?.user?.userType !== "staff" ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { id } = await params;
        const customerId = parseInt(id);

        // Validate customer exists
        const existingCustomer = await Prisma.customer.findUnique({
            where: { id: customerId },
        });

        if (!existingCustomer) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer not found.",
            });
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = customerFormSchema.partial().parse(body);

        // Prepare customer update data
        const customerUpdate: PPrisma.customerUpdateInput = {};

        // Update basic fields
        if (validatedData.name) customerUpdate.name = validatedData.name;
        if (validatedData.businessName)
            customerUpdate.businessName = validatedData.businessName;
        if (validatedData.email) customerUpdate.email = validatedData.email;
        if (validatedData.phone) customerUpdate.phone = validatedData.phone;
        if (validatedData.password)
            customerUpdate.password = validatedData.password;
        if (validatedData.gstNumber)
            customerUpdate.gstNumber = validatedData.gstNumber;
        if (validatedData.customerCategoryId)
            customerUpdate.customerCategory = {
                connect: {
                    id: validatedData.customerCategoryId,
                },
            };
        // Handle reference relationship
        if (validatedData.referenceId !== undefined) {
            if (validatedData.referenceId === "") {
                customerUpdate.referedBy = { disconnect: true };
            } else {
                const referenceId = parseInt(validatedData.referenceId);
                if (!isNaN(referenceId)) {
                    customerUpdate.referedBy = { connect: { id: referenceId } };
                }
            }
        }
        // Update customer
        await Prisma.customer.update({
            where: { id: customerId },
            data: customerUpdate,
        });

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
                    ownerId: customerId,
                    ownerType: "CUSTOMER",
                },
            });

            if (existingAddress) {
                // Update existing address
                await Prisma.address.update({
                    where: { id: existingAddress.id },
                    data: addressData,
                });
            }
        }

        // Fetch updated customer with relations
        const customer = await Prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                customerCategory: true,
                referedBy: true,
            },
        });

        const customerAddress = await Prisma.address.findFirst({
            where: {
                ownerId: customer?.id,
                ownerType: "CUSTOMER",
            },
        });

        // Transform to maintain response format
        const customerWithAddress = {
            ...customer,
            address: customerAddress,
        };

        return serverResponse({
            status: 200,
            success: true,
            message: "Customer updated successfully.",
            data: customerWithAddress,
        });
    } catch (error) {
        console.error("Error updating customer:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update customer.",
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
        if (!session) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;

        const customer = await Prisma.customer.delete({
            where: { id: parseInt(id) },
        });

        const address = await Prisma.address.findFirst({
            where: {
                ownerId: customer?.id,
                ownerType: "CUSTOMER",
            },
        });

        await Prisma.address.delete({
            where: {
                id: address?.id,
            },
        });

        if (!customer) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Customer deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting customer:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update customer.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
