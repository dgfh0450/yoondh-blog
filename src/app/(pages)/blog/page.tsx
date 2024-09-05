import dbConnect from '@/functions/db';
import { WithId } from 'mongodb';
import React from 'react';
import { PostResponse } from './blog';
import Card from './Card';
import styles from './blog.module.scss';

export const dynamic = 'force-dynamic';

export default async function Blog() {
    const { db, close } = await dbConnect();
    const collection = db.collection('blog_post');
    const posts = await collection.find({}, {}).toArray() as WithId<PostResponse>[];
    close();
    return (
        <div className={styles.postList}>
            {
                posts.map((data, index) =>
                    <Card key={`blog-post-${data._id}`} {...data} />
                )}
        </div>
    );
}
