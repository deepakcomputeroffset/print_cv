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

/**
 * TRANSFORM DATA
 */

const inputFile = "C:/codes/PrintingPress/upload_scripts/data/bill_book.txt";
const outputFile =
    "C:/codes/PrintingPress/upload_scripts/data/bill_book_data.json";

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

const data = getTransformedData(outputFile);

// await downloadImages(data);
// await downloadZipArchives(data);

/**
 * UPLOAD FILES
 */
// const tdata = getTransformedDataAfterDownloadWithOriginalNames(data);
// console.log(JSON.stringify(tdata, null, 2));

// completeUploadWorkflow(tdata);

uploadToDatabase(11, []);
