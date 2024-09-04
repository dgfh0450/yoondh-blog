import dbConnect from "@/functions/db";
import korTime from "@/functions/time";
import time from "@/functions/time";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../../functions/image";

export async function GET(req:NextRequest, res:NextResponse) {
    console.log('here');
    return NextResponse.json({message:'test'});
}

export async function POST(req:NextRequest, res:NextResponse) {
    try {
        const {db, close} = await dbConnect();
        if(!db) return;
        const postCollection = db.collection('blog_post');

        const formData = await req.formData();
        const title = formData.get('title') as string;
        const body = formData.get('body') as string;
        const thumbnail = formData.get('thumbnail') as File;

        
        const data: {
            title: string;
            body: string;
            thumbnail?: string;
            created: Date
        } = {
            title: title,
            body: body,
            created: korTime()
        };

        if(thumbnail) {
            const filename = await uploadImage(thumbnail);
            data.thumbnail = `${process.env.API_URL}/image/blog/${filename}`;
        }

        const insertResult = await postCollection.insertOne(data);
        close();
        
        return NextResponse.json({postId:insertResult.insertedId});    
    }
    catch(err) {

    }
    return NextResponse.json({message:'test'});
}