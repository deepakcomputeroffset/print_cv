export const mockCategories = [
    {
        id: "1",
        name: "Business Cards & Stationery",
        description: "Professional business cards and stationery items",
        imageUrl:
            "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80",
        parentId: null,
        subCategories: [
            {
                id: "1-1",
                name: "Business Cards",
                description:
                    "Premium quality business cards with various finishes",
                imageUrl:
                    "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 5,
                },
            },
            {
                id: "1-2",
                name: "Letterheads",
                description:
                    "Professional letterheads for business correspondence",
                imageUrl:
                    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 3,
                },
            },
        ],
        _count: {
            subCategories: 2,
            products: 0,
        },
    },
    {
        id: "2",
        name: "Marketing Materials",
        description: "Promotional materials for your business",
        imageUrl:
            "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
        parentId: null,
        subCategories: [
            {
                id: "2-1",
                name: "Brochures",
                description: "Professional brochures in various styles",
                imageUrl:
                    "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 4,
                },
            },
            {
                id: "2-2",
                name: "Flyers",
                description: "Eye-catching flyers for promotions",
                imageUrl:
                    "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 3,
                },
            },
            {
                id: "2-3",
                name: "Posters",
                description: "Large format posters for maximum impact",
                imageUrl:
                    "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 2,
                },
            },
        ],
        _count: {
            subCategories: 3,
            products: 0,
        },
    },
    {
        id: "3",
        name: "Signs & Banners",
        description: "Large format printing solutions",
        imageUrl:
            "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
        parentId: null,
        subCategories: [
            {
                id: "3-1",
                name: "Indoor Banners",
                description: "High-quality banners for indoor use",
                imageUrl:
                    "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 3,
                },
            },
            {
                id: "3-2",
                name: "Outdoor Banners",
                description: "Weather-resistant outdoor banners",
                imageUrl:
                    "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
                _count: {
                    subCategories: 0,
                    products: 4,
                },
            },
        ],
        _count: {
            subCategories: 2,
            products: 0,
        },
    },
];

export const mockSubCategories = {
    "1": [
        {
            id: "1-1",
            name: "Business Cards",
            description: "Premium quality business cards with various finishes",
            imageUrl:
                "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 5,
            },
        },
        {
            id: "1-2",
            name: "Letterheads",
            description: "Professional letterheads for business correspondence",
            imageUrl:
                "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 3,
            },
        },
    ],
    "2": [
        {
            id: "2-1",
            name: "Brochures",
            description: "Professional brochures in various styles",
            imageUrl:
                "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 4,
            },
        },
        {
            id: "2-2",
            name: "Flyers",
            description: "Eye-catching flyers for promotions",
            imageUrl:
                "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 3,
            },
        },
        {
            id: "2-3",
            name: "Posters",
            description: "Large format posters for maximum impact",
            imageUrl:
                "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 2,
            },
        },
    ],
    "3": [
        {
            id: "3-1",
            name: "Indoor Banners",
            description: "High-quality banners for indoor use",
            imageUrl:
                "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 3,
            },
        },
        {
            id: "3-2",
            name: "Outdoor Banners",
            description: "Weather-resistant outdoor banners",
            imageUrl:
                "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
            _count: {
                subCategories: 0,
                products: 4,
            },
        },
    ],
};
