"use server";

import { Prisma } from "@/lib/prisma";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import {
    allowedRoleForCarouselManagement,
    allowedRoleForCategoryAndProductManagement,
    defaultCarouselPerPage,
} from "@/lib/constants";
import { auth } from "@/lib/auth";
import { deleteFile, uploadFile } from "@/lib/storage";
import { revalidatePath, revalidateTag } from "next/cache";
import { QueryParams } from "@/types/types";

export async function getCarousels(params: QueryParams = {}) {
    try {
        console.log(params);
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            throw new Error("Unauthorized");
        }

        const where: PrismaType.carouselWhereInput = {
            AND: [
                params.search
                    ? {
                          OR: [
                              {
                                  title: {
                                      contains: params?.search,
                                      mode: "insensitive",
                                  },
                              },
                              !isNaN(parseInt(params?.search))
                                  ? {
                                        id: {
                                            gte: parseInt(params.search),
                                        },
                                    }
                                  : {},
                          ],
                      }
                    : {},
            ],
        };

        const [carousels, totalCount] = await Prisma.$transaction([
            Prisma.carousel.findMany({
                where,
                orderBy: {
                    [params?.sortby ?? "order"]: params?.sortorder ?? "asc",
                },
                skip: params.page
                    ? (params.page - 1) *
                      (params.perpage
                          ? Number(params.perpage)
                          : defaultCarouselPerPage)
                    : 0,
                take: params.perpage
                    ? Number(params.perpage)
                    : defaultCarouselPerPage,
            }),
            Prisma.carousel.count({ where }),
        ]);

        return {
            data: carousels,
            totalCount,
            currentPage: params.page || 1,
            totalPages: Math.ceil(
                totalCount / (params.perpage || defaultCarouselPerPage),
            ),
        };
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Error while fetching carousels.",
        );
    }
}

export async function createCarousel(
    data: {
        title: string;
        description?: string;
        linkUrl?: string;
        isActive?: boolean;
        order?: number;
    },
    image?: File,
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCarouselManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            throw new Error("Unauthorized");
        }

        let imageUrl = "";
        if (image) {
            imageUrl = await uploadFile("carousel", image, image.name);
        }

        const carousel = await Prisma.carousel.create({
            data: {
                title: data.title,
                description: data.description || null,
                imageUrl,
                linkUrl: data.linkUrl || null,
                isActive: data.isActive ?? true,
                order: data.order ?? 0,
            },
        });

        revalidatePath("/admin/carousel");
        revalidateTag("carousel");
        return carousel;
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Error while creating carousel.",
        );
    }
}

export async function updateCarousel(
    id: number,
    data: {
        title?: string;
        description?: string;
        linkUrl?: string;
        isActive?: boolean;
        order?: number;
    },
    image?: File,
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            throw new Error("Unauthorized");
        }
        // eslint-disable-next-line
        const updateData: any = {
            title: data.title,
            description: data.description,
            linkUrl: data.linkUrl,
            isActive: data.isActive,
            order: data.order,
        };

        if (image) {
            updateData.imageUrl = await uploadFile(
                "carousel",
                image,
                image.name,
            );
        }

        const carousel = await Prisma.carousel.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/carousel");
        revalidateTag("carousel");

        return carousel;
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Error while updating carousel.",
        );
    }
}

export async function deleteCarousel(id: number) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            throw new Error("Unauthorized");
        }

        const carousel = await Prisma.carousel.delete({
            where: { id },
        });

        deleteFile(carousel.imageUrl);

        revalidateTag("carousel");
        revalidatePath("/admin/carousel");
        return { success: true };
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Error while deleting carousel.",
        );
    }
}

export async function updateCarouselOrder(id: number, order: number) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            throw new Error("Unauthorized");
        }

        if (typeof order !== "number" || order < 0) {
            throw new Error("Invalid order value");
        }

        const carousel = await Prisma.carousel.update({
            where: { id },
            data: { order },
        });

        revalidateTag("carousel");
        revalidatePath("/admin/carousel");
        return carousel;
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Error while updating carousel order.",
        );
    }
}

export async function getActiveCarousels() {
    try {
        const carousels = await Prisma.carousel.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });

        return carousels;
    } catch (error) {
        console.error(error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Error while fetching carousels.",
        );
    }
}
