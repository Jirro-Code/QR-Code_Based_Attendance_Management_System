import nodemailer from "nodemailer";
import {env} from "../../env.ts";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: true,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_API_KEY,
    },
});

export const sendPasswordResetOTP = async (email: string, otp: string) => {
    return await transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "AttendScan Password Reset OTP",
        text: `Your AttendScan password reset OTP is ${otp}. This OTP expires in 5 minutes.`,
        html: `
            <h2>AttendScan Password Reset</h2>
            
            <p>Your password reset OTP is:</p>
            
            <h1>${otp}</h1>
            
            <p>This OTP will expire in 5 minutes.</p>
            
            <p>If you did not request a password reset, you can ignore this email.</p>
        `,
    });
};