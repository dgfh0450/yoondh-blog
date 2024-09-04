import { WithId } from 'mongodb';
import React from 'react';
import { PostResponse } from './blog';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.scss';

export default function Card({ _id, title, body, created, thumbnail }: WithId<PostResponse>) {
    const createdDate = created.toLocaleDateString().split('/');
    const [_month, _date, _year] = createdDate;
    const year = _year.slice(2);
    const month = _month.padStart(2, '0');
    const date = _date.padStart(2, '0');

    return (
        <Link className={styles.container} href={`/blog/${_id}`}>
            <div className={styles.imgWrapper}>
                {thumbnail && <Image src={thumbnail} width={100} height={100} layout='responsive' alt='post-thumbnail' />}
            </div>
            <div className={styles.textContainer}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.created}>{year}.{month}.{date}</p>
            </div>
        </Link>
    )
}
