import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest as request, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/app/helpers/mailer";

connectDB();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        if (!username || !email || !password) {
            return NextResponse.json({
                error: true,
                msg: 'All fields are required',
                status: 404
            })
        }
        const finduser = await User.findOne({ email });
        if (finduser) {
            return NextResponse.json({
                error: true,
                msg: 'User already exists',
                status: 400

            })
        }
        const solt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, solt)


        const user = new User({
            username,
            email,
            password: hashPassword
        });

        const savedUser = await user.save();
        console.log("saved user", savedUser);
        // send email
        await sendMail({ email, emailType: "verification", userId: savedUser._id });
        return NextResponse.json({
            success: true,
            error: false,
            msg: 'User Registration Successful',
            data: savedUser
        })
    } catch (e) {
        return NextResponse.json({
            error: true,
            msg: 'Server failed',
            status: 500
        })
    }
}