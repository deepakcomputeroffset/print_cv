export const mockOrders = [
    {
        id: "order1",
        user: {
            name: "John Doe",
            email: "john@example.com",
        },
        items: [
            {
                id: "item1",
                product: {
                    name: "Premium Business Cards",
                    price: 49.99,
                },
                quantity: 2,
                price: 99.98,
            },
        ],
        status: "COMPLETED",
        totalAmount: 99.98,
        createdAt: "2024-03-01T10:00:00Z",
    },
    {
        id: "order2",
        user: {
            name: "Jane Smith",
            email: "jane@example.com",
        },
        items: [
            {
                id: "item2",
                product: {
                    name: "Vinyl Banner",
                    price: 79.99,
                },
                quantity: 1,
                price: 79.99,
            },
        ],
        status: "PENDING",
        totalAmount: 79.99,
        createdAt: "2024-03-10T15:30:00Z",
    },
    {
        id: "order3",
        user: {
            name: "Mike Johnson",
            email: "mike@example.com",
        },
        items: [
            {
                id: "item3",
                product: {
                    name: "Tri-fold Brochure",
                    price: 199.99,
                },
                quantity: 3,
                price: 599.97,
            },
        ],
        status: "PROCESSING",
        totalAmount: 599.97,
        createdAt: "2024-03-15T09:45:00Z",
    },
];
