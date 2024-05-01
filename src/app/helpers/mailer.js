import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }) => {
    try {
        const hasedToken = await bcryptjs.hash(userId.toString(), 10)
        if (emailType === 'verification') {
            await User.findByIdAndUpdate(userId,
                { verifyToken: hasedToken, verifyTokenExpiry: Date.now() + 3600000 },
            );
        } else if (emailType === 'reset') {
            await User.findByIdAndUpdate(userId,
                { forgotPasswordToken: hasedToken, forgotPasswordExpiry: Date.now() + 3600000 },
            );
        }
        const transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "bc93911eb4c344",
                  pass: "932f87c81b4187"
                }
        });

        const mailOptions = {
            from: 'talhajubair1999.bd@gmail.com',
            to: email,
            subject: emailType === "verification" ? "Email Verification" : "Password Reset",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hasedToken}">here</a> to ${emailType === "verification" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hasedToken}
            </p>`,
        }
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        throw new Error(error.message);
    }
}