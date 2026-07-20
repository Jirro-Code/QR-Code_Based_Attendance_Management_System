import bcypt from "bcrypt";
import { env } from "../../env.ts";

export const hashPassword = async (password: string): Promise<string> => {
    return await bcypt.hash(password, env.BCRYPT_ROUNDS || 12);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcypt.compare(password, hashedPassword);
}