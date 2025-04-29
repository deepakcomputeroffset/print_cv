import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma = new PrismaClient();

async function seedAdminUser() {
    try {
        // Check if admin already exists to avoid duplicates
        if (
            !process.env.ADMIN_PHONE ||
            !process.env.ADMIN_PASSWORD ||
            !process.env.ADMIN_EMAIL
        )
            return;
        const adminExists = await prisma.staff.findFirst({
            where: {
                phone: process.env.ADMIN_PHONE,
                role: "ADMIN",
            },
        });

        if (!adminExists) {
            // Create the admin user if it doesn't exist
            const hashedPassword = await bcryptjs.hash(
                process.env.ADMIN_PASSWORD,
                parseInt(process.env.SALT),
            );

            await prisma.staff.create({
                data: {
                    name: "Administrator",
                    phone: process.env.ADMIN_PHONE,
                    email: process.env.ADMIN_EMAIL,
                    password: hashedPassword,
                    role: "ADMIN",
                },
            });

            console.log("✅ Admin user created successfully");
        } else {
            console.log("ℹ️ Admin user already exists, skipping creation");
        }
    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Execute the function
seedAdminUser();
