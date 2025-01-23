import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/hash";
import { customerFormSchema } from "@/schemas/customer-register-schema";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log(data);
        const { success, data: safeData } = customerFormSchema?.safeParse(data);

        if (!success) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 },
            );
        }

        // Check if customer already exists
        const exit_customer = await prisma.customer.findUnique({
            where: { phone: safeData?.phone },
        });

        if (exit_customer) {
            return NextResponse.json(
                {
                    success: false,
                    message: "customer already exist with this phone number",
                },
                { status: 400 },
            );
        }

        // Create customer
        const customer = await prisma.customer.create({
            data: {
                name: safeData?.name,
                business_name: safeData?.business_name,
                phone: safeData?.phone,
                email: safeData?.email,
                password: await generateHash(safeData?.password),
                address: {
                    create: {
                        line: safeData?.line,
                        pin_code: safeData?.pin_code,
                        city_id: Number(safeData?.city),
                    },
                },
            },
        });

        return NextResponse.json(
            { success: true, message: "User created successfully", customer },
            { status: 201 },
        );
    } catch (error) {
        console.error("Registration error:", `${error}`);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}
