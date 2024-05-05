import { NextRequest as request } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
        return tokenData.id;
    } catch (e) {
        return NextResponse.json({
            error: true,
            msg: 'Server failed',
            status: 500
        })
    }
}
