import {
    productAttributeWithOptions,
    ProductItemTypeOnlyWithPrice,
    ProductTypeOnlyWithPrice,
} from "@/types/types";

export default function getDistinctOptionsWithDetails(
    product: ProductTypeOnlyWithPrice & {
        product_items: ProductItemTypeOnlyWithPrice[];
    },
): productAttributeWithOptions[] {
    const distinctOptions: { [key: string]: productAttributeWithOptions } = {};

    if (product && product.product_items) {
        product.product_items.forEach((item) => {
            if (item.product_attribute_options) {
                item.product_attribute_options.forEach((option) => {
                    if (option.product_attribute_type) {
                        const attributeName: string =
                            option.product_attribute_type.name;

                        if (!distinctOptions[attributeName]) {
                            distinctOptions[attributeName] = {
                                ...option.product_attribute_type,
                                product_attribute_options: [], // Initialize as an EMPTY ARRAY
                            };
                        }

                        // Check if the option already exists (using find by id)
                        const existingOption = distinctOptions[
                            attributeName
                        ].product_attribute_options.find(
                            (opt) => opt.id === option.id,
                        );

                        if (!existingOption) {
                            distinctOptions[
                                attributeName
                            ].product_attribute_options.push(option);
                        }
                    }
                });
            }
        });
    }

    return Object.values(distinctOptions);
}
