import crypto from "crypto";

export const generatePasswordResetOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
}

export const hashPasswordResetOTP = (otp: string) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
}