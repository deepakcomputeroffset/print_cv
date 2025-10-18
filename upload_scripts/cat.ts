import { Prisma } from "@/lib/prisma.js";

const categoryWithGCS = [
    {
        id: 1,
        name: "Visiting Card",
        img: "https://storage.googleapis.com/printvc/design_category/Visiting_Card_1753456202446.jpg",
    },
    {
        id: 2,
        name: "Die Cut Visiting Card",
        img: "https://storage.googleapis.com/printvc/design_category/Die_Cut_Visiting_Card_1753456202449.jpg",
    },
    {
        id: 3,
        name: "Letter Head",
        img: "https://storage.googleapis.com/printvc/design_category/Letter_Head_1753456202449.jpg",
    },
    {
        id: 4,
        name: "Envelope",
        img: "https://storage.googleapis.com/printvc/design_category/Envelope_1753456202450.jpg",
    },
    {
        id: 5,
        name: "Bill Book",
        img: "https://storage.googleapis.com/printvc/design_category/Bill_Book_1753456202450.jpg",
    },
    {
        id: 6,
        name: "ATM Pouch",
        img: "https://storage.googleapis.com/printvc/design_category/ATM_Pouch_1753456202450.jpg",
    },
    {
        id: 7,
        name: "Doctor Files",
        img: "https://storage.googleapis.com/printvc/design_category/Doctor_Files_1753456202451.jpg",
    },
    {
        id: 8,
        name: "UV Texture",
        img: "https://storage.googleapis.com/printvc/design_category/UV_Texture_1753456202451.jpg",
    },
    {
        id: 9,
        name: "Garments Tags",
        img: "https://storage.googleapis.com/printvc/design_category/Garments_Tags_1753456202452.jpg",
    },
    {
        id: 10,
        name: "Sticker",
        img: "https://storage.googleapis.com/printvc/design_category/Sticker_1753456202452.jpg",
    },
    {
        id: 11,
        name: "ID Card",
        img: "https://storage.googleapis.com/printvc/design_category/ID_Card_1753456202452.jpg",
    },
];

const data = await Prisma.designCategory.createMany({
    data: categoryWithGCS,
});
console.log(data);
