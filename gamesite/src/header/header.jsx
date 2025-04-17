import React from "react";
import styles from "./header.module.css";
import { Link } from "react-router-dom"; // Import Link

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>MyLogo</div>
      <nav className={styles.nav}>
        <a href="/" className={styles.link}>Home</a>
        <a href="#about" className={styles.link}>About</a>
        <a href="#contact" className={styles.link}>Contact</a>
        <Link to="/login" className={styles.loginButton}>Login</Link>
      </nav>
    </header>
  );
};

export default Header;