import { Prisma } from "@/lib/prisma";
import { ROLE } from "@prisma/client";
import { allowedRoleForAccountManagement } from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";
import { customerCategorySchema } from "@/schemas/customer.category.form.schema";

export async function GET() {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType !== "staff" ||
            !allowedRoleForAccountManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const categories = await Prisma.customerCategory.findMany({
            orderBy: {
                level: "asc",
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: categories,
            message: "Customer categories fetched successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching customer categories",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType !== "staff" ||
            !allowedRoleForAccountManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const body = await request.json();
        const validation = customerCategorySchema.safeParse(body);

        if (!validation.success) {
            return serverResponse({
                status: 400,
                success: false,
                error: validation.error.errors,
                message: "Invalid category data",
            });
        }

        const { name, discount, level } = validation.data;

        // Check for existing name or level
        const existingCategory = await Prisma.customerCategory.findFirst({
            where: {
                OR: [{ name }, { level }],
            },
        });

        if (existingCategory) {
            return serverResponse({
                status: 409,
                success: false,
                message:
                    existingCategory.name === name
                        ? "Category name already exists"
                        : "Category level already exists",
            });
        }

        const newCategory = await Prisma.customerCategory.create({
            data: { name, discount, level },
        });

        return serverResponse({
            status: 201,
            success: true,
            data: newCategory,
            message: "Customer category created successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error creating customer category",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType !== "staff" ||
            !allowedRoleForAccountManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const body = await request.json();
        const id = parseInt(body?.id);

        if (!id) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Missing category ID",
            });
        }

        const validation = customerCategorySchema.partial().safeParse(body);

        if (!validation.success) {
            return serverResponse({
                status: 400,
                success: false,
                error: validation.error.errors,
                message: "Invalid update data",
            });
        }

        const updateData: Record<string, string | number> = {};
        if (validation.data.discount)
            updateData.discount = validation.data.discount;
        if (validation.data.name) updateData.name = validation.data.name;
        if (validation.data.level) updateData.level = validation.data.level;

        // Check for unique constraints
        const existing = await Prisma.customerCategory.findFirst({
            where: {
                OR: [
                    { name: validation.data.name },
                    { level: validation.data.level },
                ].filter(Boolean),
                NOT: { id: Number(id) },
            },
        });

        if (existing) {
            return serverResponse({
                status: 409,
                success: false,
                message:
                    existing.name === updateData.name
                        ? "Category name already exists"
                        : "Category level already exists",
            });
        }

        const updatedCategory = await Prisma.customerCategory.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return serverResponse({
            status: 200,
            success: true,
            data: updatedCategory,
            message: "Category updated successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error updating category",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType !== "staff" ||
            !allowedRoleForAccountManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        console.log(request.url, id);
        if (!id) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Missing category ID",
            });
        }

        await Prisma.customerCategory.delete({
            where: { id: Number(id) },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error deleting category",
            error: error instanceof Error ? error.message : error,
        });
    }
}
