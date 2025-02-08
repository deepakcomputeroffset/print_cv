import { ProductVariantType } from "@/types/types";

export function compareVariants(
    oldVariant: ProductVariantType,
    newVariant: ProductVariantType,
): boolean {
    // Compare basic properties
    if (
        oldVariant.sku !== newVariant.sku ||
        oldVariant.min_qty !== newVariant.min_qty ||
        oldVariant.min_price !== newVariant.min_price ||
        oldVariant.avg_price !== newVariant.avg_price ||
        oldVariant.max_price !== newVariant.max_price ||
        oldVariant.og_price !== newVariant.og_price ||
        oldVariant.is_avialable !== newVariant.is_avialable ||
        oldVariant.image_url !== newVariant.image_url
    ) {
        return false;
    }

    // Compare product options
    if (
        oldVariant.product_attribute_options.length !==
        newVariant.product_attribute_options.length
    ) {
        return false;
    }

    // Sort options by attribute ID for consistent comparison
    const sortedOldOptions = [...oldVariant.product_attribute_options].sort(
        (a, b) => a.product_attribute_type_id - b.product_attribute_type_id,
    );
    const sortedNewOptions = [...newVariant.product_attribute_options].sort(
        (a, b) => a.product_attribute_type_id - b.product_attribute_type_id,
    );

    return sortedOldOptions.every((oldOption, index) => {
        const newOption = sortedNewOptions[index];
        return (
            oldOption.product_attribute_type_id ===
                newOption.product_attribute_type_id &&
            oldOption.product_attribute_value ===
                newOption.product_attribute_value
        );
    });
}

export function processVariantChanges(
    existingVariants: ProductVariantType[],
    newVariants: ProductVariantType[],
) {
    const changes = {
        created: [] as ProductVariantType[],
        updated: [] as ProductVariantType[],
        deleted: [] as string[],
    };

    // Find created and updated variants
    newVariants.forEach((newVariant) => {
        const existingVariant = existingVariants.find(
            (ev) => ev?.sku === newVariant?.sku,
        );

        if (!existingVariant) {
            changes.created.push(newVariant);
        } else if (!compareVariants(existingVariant, newVariant)) {
            changes.updated.push(newVariant);
        }
    });

    // Find deleted variants
    existingVariants.forEach((existingVariant) => {
        const stillExists = newVariants.some(
            (nv) => nv.sku === existingVariant.sku,
        );
        if (!stillExists) {
            changes.deleted.push(existingVariant.sku);
        }
    });

    return changes;
}

export function extractAttributes(variants: ProductVariantType[]) {
    const uniqueAttributes = new Map();

    variants.forEach((variant) => {
        variant.product_attribute_options.forEach((option) => {
            if (!uniqueAttributes.has(option.product_attribute_type_id)) {
                uniqueAttributes.set(option.product_attribute_type_id, {
                    id: option.product_attribute_type_id,
                    values: new Set(),
                });
            }
            uniqueAttributes
                .get(option.product_attribute_type_id)
                .values.add(option.product_attribute_value);
        });
    });

    return Array.from(uniqueAttributes.values()).map((attr) => ({
        id: attr.id,
        name: attr.name,
        values: Array.from(attr.values),
    }));
}
