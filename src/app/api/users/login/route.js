import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest as request, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request){
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        if (!email || !password) {
            return NextResponse.json({
                error: true,
                msg: 'All fields are required',
                status: 404
            })
        }
        const user = await User.findOne({ email: email})
        if (!user) {
            return NextResponse.json({
                error: true,
                msg: 'User not found',
                status: 404
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({
                error: true,
                msg: 'Invalid credentials',
                status: 400
            })
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        const userExist = await User.findOne({ email: email, isVerified: true });
        if (!userExist) {
            return NextResponse.json({
                error: true,
                msg: 'Please verify your email',
                status: 400
            })
        }

        const response = NextResponse.json({
            success: true,
            error: false,
            msg: 'Login Successful',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            }
        })

        response.cookie.set('token', token, {
            httpOnly: true,
        })
        return response;
        
    } catch (e) {
        return NextResponse.json({
            error: true,
            msg: 'Server failed',
            status: 500
        })
    }
}
