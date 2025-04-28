import React, { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // User icon

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
      const token = localStorage.getItem("token");

      if (token) {
        return true;
      }
      return false; }
  ); // Simulated login state
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null); // ⬅️ reference for popup

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  // ⬇️ Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Fun Games
      </Link>
      <nav className={styles.nav}>
        <a href="/#values" className={styles.link}>
          Values
        </a>
        <a href="/#games" className={styles.link}>
          Games
        </a>
        <a href="/#contact" className={styles.link}>
          Contact
        </a>

        {!isLoggedIn ? (
          <Link to="/login" className={styles.loginButton}>
            Login/SignUp
          </Link>
        ) : (
          <div className={styles.userSection}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>{" "}
            {/* ahwaka aamalt zouz button login wehed fel popup w lekher hetha ken theb moez badlou 'Join Game' wala nahih ama ena l feyda famma button azrek fel les deux cas*/}
            <FaUserCircle
              className={styles.userIcon}
              onClick={togglePopup}
              size={37}
            />
            {showPopup && (
              <div className={styles.popup} ref={popupRef}>
                <Link to="/profile" className={styles.popupLink}>
                  Profile
                </Link>
                <button onClick={handleLogout} className={styles.popupButton}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
