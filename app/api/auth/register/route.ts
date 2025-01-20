import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password, businessName, phone, address } =
            await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 },
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 },
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                businessName,
                phone,
                addresses: {
                    create: {
                        // ...address as address,
                        Line: address.line,
                        pinCode: address.pinCode,
                        type: address.type,
                        district: address.district,
                    },
                },
            },
        });

        return NextResponse.json(
            { message: "User created successfully", user },
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
