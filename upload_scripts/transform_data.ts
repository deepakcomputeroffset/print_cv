import path from "path";

interface TemplateData {
    name: string;
    img: string;
    downloadUrl: string;
}

// Function to parse tab-separated data from file
function parseTSVData(fileContent: string): string[][] {
    const rows = fileContent.trim().split("\n");
    // Skip header row and process data rows
    return rows.slice(1).map((row) => row.split("\t"));
}

// Function to generate JSON in the required format
function generateJSONFromTableData(tableData: string[][]): TemplateData[] {
    const result: TemplateData[] = [];

    // Process each row
    tableData.forEach((row) => {
        // Each row contains 4 template items
        // Structure: [img1, img2, center1, download1, center2, download2, img3, img4, center3, download3, center4, download4]

        // First template item (from first img and first name/downloadUrl pair)
        if (row[0] && row[2] && row[3]) {
            result.push({
                name: row[2],
                img: row[0],
                downloadUrl: row[3],
            });
        }

        // Second template item (from second img and second name/downloadUrl pair)
        if (row[1] && row[4] && row[5]) {
            result.push({
                name: row[4],
                img: row[1],
                downloadUrl: row[5],
            });
        }

        // Third template item (from third img and third name/downloadUrl pair)
        if (row[6] && row[8] && row[9]) {
            result.push({
                name: row[8],
                img: row[6],
                downloadUrl: row[9],
            });
        }

        // Fourth template item (from fourth img and fourth name/downloadUrl pair)
        if (row[7] && row[10] && row[11]) {
            result.push({
                name: row[10],
                img: row[7],
                downloadUrl: row[11],
            });
        }
    });

    return result;
}

// Main function to process the file
function processDataFile(
    inputFilePath: string,
    outputFilePath: string,
): TemplateData[] | null {
    try {
        // Read the input file
        const fileContent = require("fs").readFileSync(inputFilePath, "utf8");

        // Parse the TSV data
        const tableData = parseTSVData(fileContent);

        // Generate JSON data
        const jsonData = generateJSONFromTableData(tableData);

        // Write to output file
        require("fs").writeFileSync(
            outputFilePath,
            JSON.stringify(jsonData, null, 2),
        );

        console.log(`Successfully transformed data!`);
        console.log(`Input: ${inputFilePath}`);
        console.log(`Output: ${outputFilePath}`);
        console.log(`Total items processed: ${jsonData.length}`);

        return jsonData;
    } catch (error) {
        console.error("Error processing file:", (error as Error).message);
        return null;
    }
}

// Alternative function that works with the exact column structure
function processLetterHeadData(
    inputFilePath: string,
    outputFilePath: string,
): TemplateData[] | null {
    try {
        const fileContent = require("fs").readFileSync(inputFilePath, "utf8");
        const rows = fileContent.trim().split("\n");
        const dataRows = rows.slice(1); // Skip header

        const result: TemplateData[] = [];

        dataRows.forEach((row) => {
            const columns = row.split("\t");

            // Process the 4 template items in each row
            // Column mapping based on the file structure:
            // 0: Image1, 1: Image2, 2: Center1, 3: Download1, 4: Center2, 5: Download2,
            // 6: Image3, 7: Image4, 8: Center3, 9: Download3, 10: Center4, 11: Download4

            // Item 1: Image1 + Center1 + Download1
            if (columns[0] && columns[2] && columns[3]) {
                result.push({
                    name: columns[2].trim(),
                    img: columns[0].trim(),
                    downloadUrl: columns[3].trim(),
                });
            }

            // Item 2: Image2 + Center2 + Download2
            if (columns[1] && columns[4] && columns[5]) {
                result.push({
                    name: columns[4].trim(),
                    img: columns[1].trim(),
                    downloadUrl: columns[5].trim(),
                });
            }

            // Item 3: Image3 + Center3 + Download3
            if (columns[6] && columns[8] && columns[9]) {
                result.push({
                    name: columns[8].trim(),
                    img: columns[6].trim(),
                    downloadUrl: columns[9].trim(),
                });
            }

            // Item 4: Image4 + Center4 + Download4
            if (columns[7] && columns[10] && columns[11]) {
                result.push({
                    name: columns[10].trim(),
                    img: columns[7].trim(),
                    downloadUrl: columns[11].trim(),
                });
            }
        });

        // Write to output file
        require("fs").writeFileSync(
            outputFilePath,
            JSON.stringify(result, null, 2),
        );

        console.log(`Successfully processed letter head data!`);
        console.log(`Generated ${result.length} items`);
        console.log(`Output saved to: ${outputFilePath}`);

        return result;
    } catch (error) {
        console.error("Error:", (error as Error).message);
        return null;
    }
}

// Generic file processor that can handle different data structures
function processTemplateFile(
    inputFilePath: string,
    outputFilePath: string,
    columnMapping: { img: number[]; name: number[]; downloadUrl: number[] },
): TemplateData[] | null {
    try {
        const fileContent = require("fs").readFileSync(inputFilePath, "utf8");
        const rows = fileContent.trim().split("\n");
        const dataRows = rows.slice(1); // Skip header

        const result: TemplateData[] = [];

        dataRows.forEach((row) => {
            const columns = row.split("\t");

            // Process based on column mapping
            for (let i = 0; i < columnMapping.img.length; i++) {
                const imageIndex = columnMapping.img[i];
                const centerIndex = columnMapping.name[i];
                const downloadIndex = columnMapping.downloadUrl[i];

                if (
                    columns[imageIndex] &&
                    columns[centerIndex] &&
                    columns[downloadIndex]
                ) {
                    result.push({
                        name: columns[centerIndex].trim(),
                        img: columns[imageIndex].trim(),
                        downloadUrl: columns[downloadIndex].trim(),
                    });
                }
            }
        });

        // Write to output file
        require("fs").writeFileSync(
            outputFilePath,
            JSON.stringify(result, null, 2),
        );

        console.log(`Successfully processed template data!`);
        console.log(`Generated ${result.length} items`);
        console.log(`Output saved to: ${outputFilePath}`);

        return result;
    } catch (error) {
        console.error("Error:", (error as Error).message);
        return null;
    }
}

function getTransformedDataAfterDownloadWithOriginalNames(
    originalData: {
        name: string;
        img: string;
        downloadUrl?: string;
    }[],
    imagesFolder: string = "C:/codes/PrintingPress/upload_scripts/downloaded_designs/images",
    zipsFolder: string = "C:/codes/PrintingPress/upload_scripts/downloaded_designs/zips",
): {
    name: string;
    img: string;
    downloadUrl?: string | null;
}[] {
    const transformedData = originalData.map((item) => {
        const { name, img, downloadUrl } = item;

        // Extract filename from URLs
        const imageUrlObject = new URL(img);
        const imageFilename = path.basename(imageUrlObject.pathname);

        const downloadUrlObject = downloadUrl ? new URL(downloadUrl) : null;
        const downloadFilename = downloadUrlObject
            ? path.basename(downloadUrlObject?.pathname)
            : null;

        // Create new structure with original name
        return {
            name: name, // Keep original name like "LH-3"
            img: path.join(imagesFolder, imageFilename),
            downloadUrl: downloadFilename
                ? path.join(zipsFolder, downloadFilename)
                : null,
        };
    });

    return transformedData;
}

export {
    processDataFile,
    processLetterHeadData,
    processTemplateFile,
    getTransformedDataAfterDownloadWithOriginalNames,
};
