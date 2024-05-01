import nodemailer from 'nodemailer';

export const sendMail = async ({ email, emailType, userId }) => {
    try {
        // TODO config mail for usage
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        const mailOptions = {
            from: 'talhajubair1999.bd@gmail.com',
            to: email,
            subject: emailType === "verification" ? "Email Verification" : "Password Reset", 
            html: "<b>Hello world?</b>",
        }
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        throw new Error(error.message);
    }
}