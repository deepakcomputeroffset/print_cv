import { Prisma } from "@/lib/prisma";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";

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
                address: {
                    include: {
                        city: {
                            include: {
                                state: true,
                            },
                        },
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

        return serverResponse({
            status: 200,
            success: true,
            data: customer,
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
        });

        if (!customer) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer not found.",
            });
        }

        const body = await request.json();
        const validatedData = customerFormSchema.partial().parse(body);

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};

        if (validatedData?.name) updateData.name = validatedData.name;
        if (validatedData?.businessName)
            updateData.businessName = validatedData.businessName;
        if (validatedData.email) updateData.email = validatedData.email;
        if (validatedData.phone) updateData.phone = validatedData.phone;
        if (validatedData.password)
            updateData.password = validatedData.password;
        if (validatedData.gstNumber)
            updateData.gstNumber = validatedData.gstNumber;

        if (
            validatedData.line ||
            validatedData.pinCode ||
            validatedData.city ||
            validatedData.state ||
            validatedData.country
        ) {
            updateData.address = {
                update: {},
            };

            if (validatedData.line)
                updateData.address.update.line = validatedData.line;
            if (validatedData.pinCode)
                updateData.address.update.pinCode = validatedData.pinCode;

            if (validatedData?.city) {
                updateData.address.update.city = {
                    connect: { id: parseInt(validatedData.city) }, // Linking to an existing city
                };
            }

            if (validatedData?.state) {
                updateData.address.update.city = {
                    update: {
                        state: {
                            connect: { id: parseInt(validatedData.state) }, // Linking to an existing state
                        },
                    },
                };
            }

            if (validatedData?.country) {
                updateData.address.update.city = {
                    update: {
                        state: {
                            update: {
                                country: {
                                    connect: {
                                        id: parseInt(validatedData.country),
                                    }, // Linking to an existing country
                                },
                            },
                        },
                    },
                };
            }
        }

        const updatedCustomer = await Prisma.customer.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                address: {
                    include: {
                        city: {
                            include: {
                                state: true,
                            },
                        },
                    },
                },
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Customer updated successfully.",
            data: updatedCustomer,
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
