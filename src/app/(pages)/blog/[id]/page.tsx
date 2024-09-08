import dbConnect from '@/functions/db';
import { ObjectId, WithId } from 'mongodb';
import React from 'react';
import { PostResponse } from '../blog';
import styles from './post.module.scss';
import '../../../../components/common/code-block.scss';
import './quill.snow.css';

export default async function Post({ params }: { params: { id: string } }) {
    const { id } = params;
    const { db, close } = await dbConnect();
    const collection = db.collection('blog_post');
    const { _id, title, body, created, thumbnail } = await collection.findOne({ _id: new ObjectId(id) }) as WithId<PostResponse>;
    await close();
    const [_month, _date, _year] = created.toLocaleDateString().split('/');;
    const year = _year.slice(2);
    const month = _month.padStart(2, '0');
    const date = _date.padStart(2, '0');

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2>{title}</h2>
                <span>윤동현 &#183; {year}.{month}.{date}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: body }} className={`${styles.body} ql-snow`}></div>
        </div>
    );
}
