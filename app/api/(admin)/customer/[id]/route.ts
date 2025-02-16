import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerFormSchema } from "@/schemas/customer.form.schema";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;
        const customer = await prisma.customer.findUnique({
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
            return NextResponse.json(
                { success: false, error: "Customer not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: customer },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json(
            { error: "Failed to fetch customer" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!customer) {
            return NextResponse.json(
                {
                    success: false,
                    message: "customer not found",
                },
                { status: 404 },
            );
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

        const updatedCustomer = await prisma.customer.update({
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

        return NextResponse.json(
            {
                success: true,
                message: "customer updated successfully",
                data: updatedCustomer,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating customer:", error);
        return NextResponse.json(
            { error: "Failed to update customer" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const customer = await prisma.customer.delete({
            where: { id: parseInt(id) },
        });

        if (!customer) {
            return NextResponse.json(
                {
                    success: false,
                    message: "customer not found",
                },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting customer:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete customer" },
            { status: 500 },
        );
    }
}
