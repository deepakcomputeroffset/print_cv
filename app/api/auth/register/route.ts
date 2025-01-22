import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/hash";

export async function POST(req: Request) {
    try {
        const { name, email, password, businessName, phone, address } =
            await req.json();

        if (!name || !phone || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 },
            );
        }

        // Check if customer already exists
        const existingUser = await prisma.customer.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 },
            );
        }

        // Create customer
        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                password: await generateHash(password),
                businessName,
                phone,
                addresses: {
                    create: {
                        // ...address as address,
                        Line: address.line,
                        pin_code: address.pinCode,
                        type: address.type,
                        city: address.city,
                    },
                },
            },
        });

        return NextResponse.json(
            { message: "User created successfully", customer },
            { status: 201 },
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}
