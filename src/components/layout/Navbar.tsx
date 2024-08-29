import Link from 'next/link';
import React from 'react';
import styles from './layout.module.scss';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link className={styles.link} href='/'>Home</Link>
            <Link className={styles.link} href='/profile'>Profile</Link>
            <Link className={styles.link} href='/project'>Project</Link>
            <Link className={styles.link} href='/blog'>Blog</Link>
        </nav>
    );
}
