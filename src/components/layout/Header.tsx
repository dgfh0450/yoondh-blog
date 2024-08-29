import React from 'react';
import Navbar from './Navbar';
import styles from './layout.module.scss';

export default function Header() {
    return (
        <header className={styles.header}>
            <Navbar/>
        </header>
    );
}
