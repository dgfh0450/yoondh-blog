import dbConnect from '@/functions/db';
import { ObjectId, WithId } from 'mongodb';
import React from 'react';
import { PostResponse } from '../blog';

export default async function Post({ params }: { params: { id: string } }) {
    const { id } = params;
    const { db, close } = await dbConnect();
    const collection = db.collection('blog_post');
    const { _id, title, body, created, thumbnail } = await collection.findOne({ _id: new ObjectId(id) }) as WithId<PostResponse>;
    return (
        <div>
            <h2>{title}</h2>
            <div dangerouslySetInnerHTML={{ __html: body }}></div>
        </div>
    );
}
