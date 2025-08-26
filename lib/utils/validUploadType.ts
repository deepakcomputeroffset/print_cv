import { UPLOAD_TYPE } from "@prisma/client";

export function isValidUploadType(
    uploadType: string,
): uploadType is UPLOAD_TYPE {
    return Object.values(UPLOAD_TYPE).includes(uploadType as UPLOAD_TYPE);
}
