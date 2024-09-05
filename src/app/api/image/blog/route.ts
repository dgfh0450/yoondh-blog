import { uploadImage } from "@/functions/image";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    const filename = await uploadImage(image);
    const url = `https://yoondh-blog.com/api/image/blog/${filename}`;

    return NextResponse.json({ 'image': url });
}