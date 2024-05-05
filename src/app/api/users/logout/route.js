import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest as request, NextResponse } from "next/server";


connectDB();

export async function GET(request) {
    try {
        const response = NextResponse.json({
            error: false,
            msg: 'Logout Successful',
            status: 200
        })

        response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
        return response;

    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error: true,
            msg: 'Server failed',
            status: 500
        })
    }
}
