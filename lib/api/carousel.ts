import {
    getCarousels,
    createCarousel as createCarouselAction,
    updateCarousel as updateCarouselAction,
    deleteCarousel as deleteCarouselAction,
    updateCarouselOrder as updateCarouselOrderAction,
    getActiveCarousels,
} from "@/app/admin/carousel/_actions/actions";
import { QueryParams } from "@/types/types";

export async function fetchCarousels(params: QueryParams = {}) {
    return await getCarousels(params);
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
    return await createCarouselAction(data, image);
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
    return await updateCarouselAction(id, data, image);
}

export async function deleteCarousel(id: number) {
    return await deleteCarouselAction(id);
}

export async function updateCarouselOrder(id: number, order: number) {
    return await updateCarouselOrderAction(id, order);
}

export async function fetchActiveCarousels() {
    return await getActiveCarousels();
}
