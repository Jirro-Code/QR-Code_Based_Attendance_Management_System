import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendPasswordResetOTP = async (
    email: string,
    otp: string
) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "AttendScan Password Reset Code",
        text: `Your AttendScan password reset code is ${otp}. This code expires in 5 minutes.`,
        html: `
            <h2>AttendScan Password Reset</h2>
            
            <p>Your password reset verification code is:</p>
            
            <h1>${otp}</h1>
            
            <p>This code will expire in 5 minutes.</p>
            
            <p>If you did not request a password reset, you can ignore this email.</p>
        `,
    });
};