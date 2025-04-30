import { Prisma } from "@/lib/prisma";
import { ProductAttributeTypeSchema } from "@/schemas/product.attribute.type.form.schema";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const { searchParams } = new URL(request.url);

        if (isNaN(parseInt(searchParams?.get("productCategoryId") || ""))) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Invalid product category id.",
            });
        }
        const productAttributeTypes =
            await Prisma.productAttributeType.findMany({
                where: {
                    productCategoryId: parseInt(
                        searchParams?.get("productCategoryId") || "",
                    ),
                },
            });

        return serverResponse({
            status: 200,
            success: true,
            data: productAttributeTypes,
            message: "Product Attributes fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching product attribute type:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching product attribute types.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const data = await req.json();

        const { success, data: safeData } =
            ProductAttributeTypeSchema.safeParse(data);

        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid product attribute type data",
            });
        }

        const createdProduct_attribute =
            await Prisma.productAttributeType.create({
                data: safeData,
            });

        return serverResponse({
            status: 201,
            success: true,
            message: "product attribute type created successfully",
            data: createdProduct_attribute,
        });
    } catch (error) {
        console.error("Error creating product attribute type: ", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error creating product attribute type.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
