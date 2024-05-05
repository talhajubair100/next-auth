import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest as request, NextResponse } from "next/server"; 
import { getDataFromToken } from "@/app/helpers/getDataFromToken";

connectDB();

export async function GET(request) {
    try {
        const userID = await getDataFromToken(request);
        const user = await User.findById({_id: userID}).select("-password");
        if (!user) {
            return NextResponse.json({
                error: true,
                msg: 'User not found',
                status: 404
            })
        }
        return NextResponse.json({
            success: true,
            error: false,
            msg: 'User found',
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
