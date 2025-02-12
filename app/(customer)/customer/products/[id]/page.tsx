// export default async function ProductPage({
//     param,
// }: {
//     param: Promise<{ id: number }>;
// }) {
//     console.log(param);
//     return (
//         <div className="container">
//             <p>Product Page</p>
//         </div>
//     );
// }

// first design

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { ShoppingCart, Heart, Share2, Package, Truck, Shield } from "lucide-react";

// interface AttributeType {
//   id: number;
//   name: string;
// }

// interface AttributeValue {
//   id: number;
//   product_attribute_type_id: number;
//   product_attribute_value: string;
// }

// interface ProductItem {
//   id: number;
//   sku: string;
//   min_qty: number;
//   og_price: number;
//   min_price: number;
//   avg_price: number;
//   max_price: number;
//   image_url: string[];
//   is_avialable: boolean;
//   product_attribute_options: AttributeValue[];
// }

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   image_url: string[];
//   category_id: number;
//   is_avialable: boolean;
//   sku: string;
//   min_qty: number;
//   og_price: number;
//   min_price: number;
//   avg_price: number;
//   max_price: number;
//   product_items: ProductItem[];
// }

// // Dummy data
// const dummyProduct: Product = {
//   id: 1,
//   name: "Premium Business Cards",
//   description: "High-quality business cards with various printing options and finishes",
//   image_url: [
//     "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800",
//     ,
//   ],
//   category_id: 1,
//   is_avialable: true,
//   sku: "BC-001",
//   min_qty: 100,
//   og_price: 2000,
//   min_price: 1500,
//   avg_price: 1750,
//   max_price: 2500,
//   product_items: [
//     {
//       id: 1,
//       sku: "BC-001-1",
//       min_qty: 100,
//       og_price: 2000,
//       min_price: 1500,
//       avg_price: 1750,
//       max_price: 2000,
//       image_url: ["https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800"],
//       is_avialable: true,
//       product_attribute_options: [
//         { id: 1, product_attribute_type_id: 1, product_attribute_value: "Single Side" },
//         { id: 2, product_attribute_type_id: 2, product_attribute_value: "Standard" },
//       ],
//     },
//     {
//       id: 2,
//       sku: "BC-001-2",
//       min_qty: 100,
//       og_price: 2500,
//       min_price: 2000,
//       avg_price: 2250,
//       max_price: 2500,
//       image_url: [],
//       is_avialable: true,
//       product_attribute_options: [
//         { id: 3, product_attribute_type_id: 1, product_attribute_value: "Both Side" },
//         { id: 4, product_attribute_type_id: 2, product_attribute_value: "Die Cut" },
//       ],
//     },
//   ],
// };

// const attributeTypes: AttributeType[] = [
//   { id: 1, name: "Printing" },
//   { id: 2, name: "Shape" },
// ];

// export default function ProductPage() {
//   const params = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [selectedAttributes, setSelectedAttributes] = useState<Record<number, string>>({});
//   const [selectedVariant, setSelectedVariant] = useState<ProductItem | null>(null);
//   const [quantity, setQuantity] = useState<number>(100);
//   const [mainImage, setMainImage] = useState<string>("");

//   useEffect(() => {
//     // In a real app, fetch the product data
//     setProduct(dummyProduct);
//     setMainImage(dummyProduct.image_url[0]);
//   }, []);

//   useEffect(() => {
//     if (product && Object.keys(selectedAttributes).length === attributeTypes.length) {
//       const variant = product.product_items.find(item =>
//         item.product_attribute_options.every(
//           option =>
//             selectedAttributes[option.product_attribute_type_id] === option.product_attribute_value
//         )
//       );
//       setSelectedVariant(variant || null);
//     } else {
//       setSelectedVariant(null);
//     }
//   }, [selectedAttributes, product]);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   const getAttributeValues = (attributeTypeId: number) => {
//     const values = new Set<string>();
//     product.product_items.forEach(item => {
//       item.product_attribute_options.forEach(option => {
//         if (option.product_attribute_type_id === attributeTypeId) {
//           values.add(option.product_attribute_value);
//         }
//       });
//     });
//     return Array.from(values);
//   };

//   const handleAddToCart = () => {
//     if (!selectedVariant) return;
//     toast.success("Added to cart successfully!");
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Product Images */}
//         <div className="space-y-4">
//           <div className="aspect-square relative rounded-lg overflow-hidden">
//             <Image
//               src={mainImage}
//               alt={product.name}
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="grid grid-cols-5 gap-2">
//             {product.image_url.map((url) => (
//               <div
//                 key={url}
//                 className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 ${
//                   mainImage === url ? "border-primary" : "border-transparent"
//                 }`}
//                 onClick={() => setMainImage(url)}
//               >
//                 <Image
//                   src={url}
//                   alt={product.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold">{product.name}</h1>
//             <p className="text-muted-foreground mt-2">{product.description}</p>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-baseline gap-4">
//               <span className="text-3xl font-bold">
//                 ₹{selectedVariant ? selectedVariant.min_price : product.min_price}
//               </span>
//               <span className="text-xl text-muted-foreground line-through">
//                 ₹{selectedVariant ? selectedVariant.og_price : product.og_price}
//               </span>
//               <Badge className="bg-green-500">
//                 {Math.round(((selectedVariant?.og_price || product.og_price) - (selectedVariant?.min_price || product.min_price)) / (selectedVariant?.og_price || product.og_price) * 100)}% OFF
//               </Badge>
//             </div>

//             {attributeTypes.map((type) => (
//               <div key={type.id}>
//                 <label className="text-sm font-medium mb-2 block">
//                   {type.name}
//                 </label>
//                 <Select
//                   value={selectedAttributes[type.id] || ""}
//                   onValueChange={(value) =>
//                     setSelectedAttributes((prev) => ({
//                       ...prev,
//                       [type.id]: value,
//                     }))
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder={`Select ${type.name}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {getAttributeValues(type.id).map((value) => (
//                       <SelectItem key={value} value={value}>
//                         {value}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             ))}

//             <div>
//               <label className="text-sm font-medium mb-2 block">
//                 Quantity
//               </label>
//               <Input
//                 type="number"
//                 min={selectedVariant?.min_qty || product.min_qty}
//                 value={quantity}
//                 onChange={(e) => setQuantity(parseInt(e.target.value) || product.min_qty)}
//                 className="w-32"
//               />
//               <p className="text-sm text-muted-foreground mt-1">
//                 Minimum quantity: {selectedVariant?.min_qty || product.min_qty}
//               </p>
//             </div>

//             <div className="flex gap-4">
//               <Button
//                 size="lg"
//                 className="flex-1"
//                 onClick={handleAddToCart}
//                 disabled={!selectedVariant}
//               >
//                 <ShoppingCart className="w-4 h-4 mr-2" />
//                 Add to Cart
//               </Button>
//               <Button size="lg" variant="outline">
//                 <Heart className="w-4 h-4 mr-2" />
//                 Wishlist
//               </Button>
//               <Button size="lg" variant="outline">
//                 <Share2 className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           <Separator />

//           {/* Product Features */}
//           <Card className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="flex items-center gap-3">
//                 <Package className="w-8 h-8 text-primary" />
//                 <div>
//                   <h3 className="font-medium">Premium Quality</h3>
//                   <p className="text-sm text-muted-foreground">
//                     High-quality materials
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Truck className="w-8 h-8 text-primary" />
//                 <div>
//                   <h3 className="font-medium">Fast Delivery</h3>
//                   <p className="text-sm text-muted-foreground">
//                     3-5 business days
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Shield className="w-8 h-8 text-primary" />
//                 <div>
//                   <h3 className="font-medium">Satisfaction Guarantee</h3>
//                   <p className="text-sm text-muted-foreground">
//                     100% money back
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    ShoppingCart,
    Heart,
    Share2,
    Package,
    Truck,
    Shield,
} from "lucide-react";

import EmblaCarousel from "@/components/ui/embla-carousel/js/EmblaCarousel";

interface AttributeType {
    id: number;
    name: string;
}

interface AttributeValue {
    id: number;
    product_attribute_type_id: number;
    product_attribute_value: string;
}

interface ProductItem {
    id: number;
    sku: string;
    min_qty: number;
    og_price: number;
    min_price: number;
    avg_price: number;
    max_price: number;
    image_url: string[];
    is_avialable: boolean;
    product_attribute_options: AttributeValue[];
}

interface Product {
    id: number;
    name: string;
    description: string;
    image_url: string[];
    category_id: number;
    is_avialable: boolean;
    sku: string;
    min_qty: number;
    og_price: number;
    min_price: number;
    avg_price: number;
    max_price: number;
    product_items: ProductItem[];
}

const dummyProduct: Product = {
    id: 1,
    name: "Premium Business Cards",
    description:
        "High-quality business cards with various printing options and finishes",
    image_url: [
        "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800",
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
    ],
    category_id: 1,
    is_avialable: true,
    sku: "BC-001",
    min_qty: 100,
    og_price: 2000,
    min_price: 1500,
    avg_price: 1750,
    max_price: 3500,
    product_items: [
        {
            id: 1,
            sku: "BC-SS-STD-MAT",
            min_qty: 100,
            og_price: 2000,
            min_price: 1500,
            avg_price: 1750,
            max_price: 2000,
            image_url: [
                "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800",
            ],
            is_avialable: true,
            product_attribute_options: [
                {
                    id: 1,
                    product_attribute_type_id: 1,
                    product_attribute_value: "Single Side",
                },
                {
                    id: 2,
                    product_attribute_type_id: 2,
                    product_attribute_value: "Standard",
                },
                {
                    id: 3,
                    product_attribute_type_id: 3,
                    product_attribute_value: "Matte",
                },
            ],
        },
        {
            id: 2,
            sku: "BC-SS-STD-GLO",
            min_qty: 100,
            og_price: 2200,
            min_price: 1700,
            avg_price: 1950,
            max_price: 2200,
            image_url: [],
            is_avialable: true,
            product_attribute_options: [
                {
                    id: 4,
                    product_attribute_type_id: 1,
                    product_attribute_value: "Single Side",
                },
                {
                    id: 5,
                    product_attribute_type_id: 2,
                    product_attribute_value: "Standard",
                },
                {
                    id: 6,
                    product_attribute_type_id: 3,
                    product_attribute_value: "Glossy",
                },
            ],
        },
        {
            id: 3,
            sku: "BC-DS-STD-MAT",
            min_qty: 150,
            og_price: 2800,
            min_price: 2300,
            avg_price: 2550,
            max_price: 2800,
            image_url: [
                "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
            ],
            is_avialable: true,
            product_attribute_options: [
                {
                    id: 7,
                    product_attribute_type_id: 1,
                    product_attribute_value: "Double Side",
                },
                {
                    id: 8,
                    product_attribute_type_id: 2,
                    product_attribute_value: "Standard",
                },
                {
                    id: 9,
                    product_attribute_type_id: 3,
                    product_attribute_value: "Matte",
                },
            ],
        },
        {
            id: 4,
            sku: "BC-DS-DIE-GLO",
            min_qty: 200,
            og_price: 3500,
            min_price: 3000,
            avg_price: 3250,
            max_price: 3500,
            image_url: [
                "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
                "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800",
            ],
            is_avialable: true,
            product_attribute_options: [
                {
                    id: 10,
                    product_attribute_type_id: 1,
                    product_attribute_value: "Double Side",
                },
                {
                    id: 11,
                    product_attribute_type_id: 2,
                    product_attribute_value: "Die Cut",
                },
                {
                    id: 12,
                    product_attribute_type_id: 3,
                    product_attribute_value: "Glossy",
                },
            ],
        },
    ],
};

const attributeTypes: AttributeType[] = [
    { id: 1, name: "Printing" },
    { id: 2, name: "Shape" },
    { id: 3, name: "Finish" },
];

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<
        Record<number, string>
    >({});
    const [selectedVariant, setSelectedVariant] = useState<ProductItem | null>(
        null,
    );
    const [quantity, setQuantity] = useState<number>(100);
    const [availableOptions, setAvailableOptions] = useState<
        Record<number, string[]>
    >({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // In production, fetch from API
                // const response = await fetch(`/api/products/${params.id}`);
                // const data = await response.json();
                // setProduct(data);
                setProduct(dummyProduct);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product");
            }
        };

        fetchProduct();
    }, [params.id]);

    useEffect(() => {
        if (product) {
            // Update available options based on selected attributes
            const newAvailableOptions: Record<number, string[]> = {};

            attributeTypes.forEach((type) => {
                const filteredItems = product.product_items.filter((item) => {
                    return Object.entries(selectedAttributes).every(
                        ([typeId, value]) => {
                            if (parseInt(typeId) === type.id) return true;
                            return item.product_attribute_options.some(
                                (opt) =>
                                    opt.product_attribute_type_id ===
                                        parseInt(typeId) &&
                                    opt.product_attribute_value === value,
                            );
                        },
                    );
                });

                const values = new Set<string>();
                filteredItems.forEach((item) => {
                    item.product_attribute_options.forEach((opt) => {
                        if (opt.product_attribute_type_id === type.id) {
                            values.add(opt.product_attribute_value);
                        }
                    });
                });

                newAvailableOptions[type.id] = Array.from(values);
            });

            setAvailableOptions(newAvailableOptions);
        }
    }, [product, selectedAttributes]);

    useEffect(() => {
        if (product) {
            const variant = product.product_items.find((item) =>
                Object.entries(selectedAttributes).every(([typeId, value]) =>
                    item.product_attribute_options.some(
                        (opt) =>
                            opt.product_attribute_type_id ===
                                parseInt(typeId) &&
                            opt.product_attribute_value === value,
                    ),
                ),
            );
            setSelectedVariant(variant || null);

            if (variant) {
                setQuantity(Math.max(quantity, variant.min_qty));
            }
        }
    }, [selectedAttributes, product]);

    const handleAttributeChange = (typeId: number, value: string) => {
        setSelectedAttributes((prev) => {
            const newAttributes = { ...prev, [typeId]: value };

            // Clear subsequent selections if they're no longer valid
            const typeIndex = attributeTypes.findIndex((t) => t.id === typeId);
            attributeTypes.forEach((type) => {
                if (
                    attributeTypes.findIndex((t) => t.id === type.id) >
                    typeIndex
                ) {
                    delete newAttributes[type.id];
                }
            });

            return newAttributes;
        });
    };

    const handleBuy = () => {
        if (!selectedVariant) return;

        const orderData = {
            productItemSku: selectedVariant.sku,
            quantity: quantity,
            selectedOptions: selectedVariant.product_attribute_options.map(
                (opt) => ({
                    type: attributeTypes.find(
                        (t) => t.id === opt.product_attribute_type_id,
                    )?.name,
                    value: opt.product_attribute_value,
                }),
            ),
        };

        console.log("Order data:", orderData);
        toast.success("Processing order...");
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images Carousel */}
                <div className="space-y-4">
                    <EmblaCarousel slides={product.image_url} />
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-muted-foreground mt-2">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                            <span className="text-3xl font-bold">
                                ₹
                                {selectedVariant
                                    ? selectedVariant.min_price
                                    : product.min_price}
                            </span>
                            <span className="text-xl text-muted-foreground line-through">
                                ₹
                                {selectedVariant
                                    ? selectedVariant.og_price
                                    : product.og_price}
                            </span>
                            <Badge className="bg-green-500">
                                {Math.round(
                                    (((selectedVariant?.og_price ||
                                        product.og_price) -
                                        (selectedVariant?.min_price ||
                                            product.min_price)) /
                                        (selectedVariant?.og_price ||
                                            product.og_price)) *
                                        100,
                                )}
                                % OFF
                            </Badge>
                        </div>

                        {attributeTypes.map((type) => (
                            <div key={type.id}>
                                <label className="text-sm font-medium mb-2 block">
                                    {type.name}
                                </label>
                                <Select
                                    value={selectedAttributes[type.id] || ""}
                                    onValueChange={(value) =>
                                        handleAttributeChange(type.id, value)
                                    }
                                    disabled={
                                        !availableOptions[type.id]?.length
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={`Select ${type.name}`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableOptions[type.id]?.map(
                                            (value) => (
                                                <SelectItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}

                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Quantity
                            </label>
                            <Input
                                type="number"
                                min={
                                    selectedVariant?.min_qty || product.min_qty
                                }
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.max(
                                            parseInt(e.target.value) ||
                                                product.min_qty,
                                            selectedVariant?.min_qty ||
                                                product.min_qty,
                                        ),
                                    )
                                }
                                className="w-32"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Minimum quantity:{" "}
                                {selectedVariant?.min_qty || product.min_qty}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={handleBuy}
                                disabled={!selectedVariant}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Buy Now
                            </Button>
                            <Button size="lg" variant="outline">
                                <Heart className="w-4 h-4 mr-2" />
                                Wishlist
                            </Button>
                            <Button size="lg" variant="outline">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Selected Options Summary */}
                    {selectedVariant && (
                        <Card className="p-4">
                            <h3 className="font-medium mb-2">
                                Selected Configuration
                            </h3>
                            <div className="space-y-1">
                                {selectedVariant.product_attribute_options.map(
                                    (opt) => (
                                        <div
                                            key={opt.id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-muted-foreground">
                                                {
                                                    attributeTypes.find(
                                                        (t) =>
                                                            t.id ===
                                                            opt.product_attribute_type_id,
                                                    )?.name
                                                }
                                                :
                                            </span>
                                            <span className="font-medium">
                                                {opt.product_attribute_value}
                                            </span>
                                        </div>
                                    ),
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        SKU:
                                    </span>
                                    <span className="font-medium">
                                        {selectedVariant.sku}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Product Features */}
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-medium">
                                        Premium Quality
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        High-quality materials
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-medium">
                                        Fast Delivery
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        3-5 business days
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-medium">
                                        Satisfaction Guarantee
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        100% money back
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
