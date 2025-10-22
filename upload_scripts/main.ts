import { get } from "http";
import {
    downloadImages,
    downloadZipArchives,
    getTransformedData,
} from "./downloader";
import {
    getTransformedDataAfterDownloadWithOriginalNames,
    processLetterHeadData,
} from "./transform_data";
import {
    completeUploadWorkflow,
    createDetailedUrlsFile,
    createUrlsFile,
    uploadFilesImage,
    uploadFilesZip,
    uploadToDatabase,
} from "./upload";
import { Prisma } from "@/lib/prisma";

/**
 * TRANSFORM DATA
 */

const inputFile = "C:/codes/PrintingPress/upload_scripts/data/bill_book.txt";
const outputFile = "C:/codes/PrintingPress/upload_scripts/data/v_c.json";

// const transformedData = processLetterHeadData(inputFile, outputFile);

// If you want to see a preview in console
// if (transformedData) {
//     console.log("\nFirst 5 items preview:");
//     console.log(JSON.stringify(transformedData.slice(0, 5), null, 2));
// }

// Alternative usage with generic processor
// const letterHeadColumnMapping = {
//     image: [0, 1, 6, 7], // Image columns
//     name: [2, 4, 8, 10], // Center columns
//     download: [3, 5, 9, 11], // Download columns
// };

// const transformedDataGeneric = processTemplateFile(
//     inputFile,
//     outputFile,
//     letterHeadColumnMapping,
// );

/**
 * DOWNLOAD IMAGES AND ZIP FILES
 */

// const data = getTransformedData(outputFile);

// await downloadImages(data);
// await downloadZipArchives(data);

/**
 * UPLOAD FILES
 */
// const tdata = getTransformedDataAfterDownloadWithOriginalNames(data);
// console.log(JSON.stringify(tdata, null, 2));

// completeUploadWorkflow(tdata);

// uploadToDatabase(11, []);

const data = await Prisma.designCategory.createMany({
    data: [
        {
            parentCategoryId: 2,
            name: "METAL VISITING CARDS",
            img: "https://storage.googleapis.com/printvc/design_category_items/metal_20vc_20new_20img_20a_1761143278705.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 1",
            img: "https://storage.googleapis.com/printvc/design_category_items/Die_201_20Sub_20Catgory_1761143278709.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 2",
            img: "https://storage.googleapis.com/printvc/design_category_items/die_20no_202_20cus_1761143278710.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 3",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20NO_203_20CUS_1761143278708.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 4",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_204_1761143278711.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 5",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_205_1761143278708.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 6",
            img: "https://storage.googleapis.com/printvc/design_category_items/1_1761143278712.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 7",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_207_1761143278709.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 8",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_208_1761143278685.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 9",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_209_1761143278712.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 10",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2010_1761143278712.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 11",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2011_1761143278712.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 12",
            img: "https://storage.googleapis.com/printvc/design_category_items/cloth_1761143278713.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 13",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2013_1761143278713.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 14",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2014_1761143278714.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 15",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2015_1761143278713.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 16",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2016_1761143278705.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 17",
            img: "https://storage.googleapis.com/printvc/design_category_items/Shoes_1761143278707.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 18",
            img: "https://storage.googleapis.com/printvc/design_category_items/18_1761143278707.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 19",
            img: "https://storage.googleapis.com/printvc/design_category_items/Blade_20Shape_20A_1761143278707.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 20",
            img: "https://storage.googleapis.com/printvc/design_category_items/JIO_20SIM_1761143278707.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 21",
            img: "https://storage.googleapis.com/printvc/design_category_items/21_1761143278706.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 22",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2022_1761143278706.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 23",
            img: "https://storage.googleapis.com/printvc/design_category_items/VV_20DIE_2023_1761143278715.jpg",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 24",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20No__2024_1761143278713.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 25",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20No__2025_1761143278708.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 26",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20No__2026_1761143278708.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 27",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20No__2027_1761143278715.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 28",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20No__2028_1761143278714.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 29",
            img: "https://storage.googleapis.com/printvc/design_category_items/AAA_1761143278714.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 30",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_20No__2030_1761143278709.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 31",
            img: "https://storage.googleapis.com/printvc/design_category_items/die_20no_2031_20cus_1761143278711.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 32",
            img: "https://storage.googleapis.com/printvc/design_category_items/Die_20No_2032_20Cus_1761143278711.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 33",
            img: "https://storage.googleapis.com/printvc/design_category_items/die_20no_2033_20cus_1761143278711.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 34",
            img: "https://storage.googleapis.com/printvc/design_category_items/Die_20No_2034_20Cus_1761143278709.png",
        },
        {
            parentCategoryId: 2,
            name: "Die No. 35",
            img: "https://storage.googleapis.com/printvc/design_category_items/Die_20No_2035_20Cus_1761143278712.png",
        },
        {
            parentCategoryId: 2,
            name: "Die Shape : 36",
            img: "https://storage.googleapis.com/printvc/design_category_items/DIE_201_1761143278710.jpg",
        },
    ],
});
console.log(data);
