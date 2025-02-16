import {
    productAttributeWithOptions,
    ProductItemTypeOnlyWithPrice,
    ProductTypeOnlyWithPrice,
} from "@/types/types";

export default function getDistinctOptionsWithDetails(
    product: ProductTypeOnlyWithPrice & {
        productItems: ProductItemTypeOnlyWithPrice[];
    },
): productAttributeWithOptions[] {
    const distinctOptions: { [key: string]: productAttributeWithOptions } = {};

    if (product && product.productItems) {
        product.productItems.forEach((item) => {
            if (item.productAttributeOptions) {
                item.productAttributeOptions.forEach((option) => {
                    if (option.productAttributeType) {
                        const attributeName: string =
                            option.productAttributeType.name;

                        if (!distinctOptions[attributeName]) {
                            distinctOptions[attributeName] = {
                                ...option.productAttributeType,
                                productAttributeOptions: [], // Initialize as an EMPTY ARRAY
                            };
                        }

                        // Check if the option already exists (using find by id)
                        const existingOption = distinctOptions[
                            attributeName
                        ].productAttributeOptions.find(
                            (opt) => opt.id === option.id,
                        );

                        if (!existingOption) {
                            distinctOptions[
                                attributeName
                            ].productAttributeOptions.push(option);
                        }
                    }
                });
            }
        });
    }

    return Object.values(distinctOptions);
}
