import bcrypt from "bcryptjs";

export const generateHash = async (plainText: string) => {
    return await bcrypt.hash(plainText, 10);
};

export const verifyHash = async (plainText: string, hashedText: string) => {
    return await bcrypt.compare(plainText, hashedText);
};
