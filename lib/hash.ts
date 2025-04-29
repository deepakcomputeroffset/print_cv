import bcrypt from "bcryptjs";

export const generateHash = async (plainText: string) => {
    return await bcrypt.hash(plainText, parseInt(process.env.SALT as string));
};

export const verifyHash = async (plainText: string, hashedText: string) => {
    return await bcrypt.compare(plainText, hashedText);
};
