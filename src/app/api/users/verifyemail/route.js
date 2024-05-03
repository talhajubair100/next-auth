import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest as request, NextResponse } from "next/server";

connectDB()

export async function POST(request){
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        if (!token) {
            return NextResponse.json({
                error: true,
                msg: 'Token is required',
                status: 404
            })
        }
        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() }});
        if (!user) {
            return NextResponse.json({
                error: true,
                msg: 'Invalid token',
                status: 400
            })
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({
            success: true,
            error: false,
            msg: 'Email Verified',
            data: user
        })
    } catch (e) {
        return NextResponse.json({
            error: true,
            msg: 'Server failed',
            status: 500
        })
    }
}