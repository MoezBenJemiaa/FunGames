import React, { useState,useEffect  } from "react";
import styles from "./Home.module.css";
import Header from "../header/header";
import GameCard from "../game/gamecard";
import RoomManager from "../Room/Room";

import finnImage from "../assets/finn.jpeg";
import bmoImage from "../assets/bmo.jpeg";
import jakeImage from "../assets/jake.jpeg";

const ScrollingBar = () => (
  <div className={styles.scrollingBar}>
    <div className={styles.scrollWrapper}>
      <div className={styles.scrollContent}>
        {Array(50).fill("🎮 Fun Games").join("  ")}
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [showRoomManager, setShowRoomManager] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");

  useEffect(() => {
    if (showRoomManager) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [showRoomManager]);
  const handlePlayClick = (gameTitle) => {
    setSelectedGame(gameTitle);
    setShowRoomManager(true);
  };

  const closeRoomManager = () => {
    setShowRoomManager(false);
    setSelectedGame("");
  };

  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.homesBackground}`} id="home">
        <Header />
        <h1>
          Bright Worlds,
          <br /> Fun for All
        </h1>
        <div className={`${styles.customFont} ${styles.coloredBox}`}>
          Discover the Energy of Life <br /> in Every ColorFul Pixel
        </div>
      </section>

      <ScrollingBar />

      <section className={styles.section} id="values">
        <h2>Our Values</h2>
        <div className={styles.grid}>
          <div className={styles.row}>
            <div className={styles.rabitBackground}></div>
            <div className={styles.cardBlue}>
              <strong>Player First</strong>
              We create games that are easy to pick up — and hard to forget
            </div>
            <div className={styles.card}>
              We blend visuals, sound and mechanics for a unique experience
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.card}>
              To us, every game should feel like a little adventure
            </div>
            <div className={styles.campfireBackground}></div>
            <div className={styles.cardBlue}>
              <strong>Beginner-friendly</strong>
              Simple interfaces and helpful tutorials
            </div>
          </div>
        </div>
      </section>

      <ScrollingBar />

      <section className={`${styles.section} ${styles.pixelbgBackground}`} id="games">
        <h2>Game Catalog</h2>
        <div className={styles.gameContainer}>
          <GameCard title="XO" image={finnImage} onPlay={() => handlePlayClick("XO")} />
          <GameCard title="Hangman" image={bmoImage} onPlay={() => handlePlayClick("Hangman")} />
          <GameCard title="3rd Game" image={jakeImage} onPlay={() => handlePlayClick("3rd Game")} />
        </div>
      </section>

      <ScrollingBar />

      <section className={`${styles.section} ${styles.customFont}`} id="contact">
        <h2>Contact Us</h2>
        <div className={styles.contactWrapper}>
          <form
            className={styles.registerForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className={styles.input}
              required
            />
            <textarea
              placeholder="Write your message here"
              rows={4}
              required
            />
            <button type="submit" className={styles.button}>
              Send a Message
            </button>
          </form>
          <div className={`${styles.section} ${styles.shopBackground}`}></div>
        </div>
      </section>

      <div className={styles.footer}>
        <span className={styles.footerText}>Fun Games</span>
        <span className={styles.copyrightText}>© 2025 Fun Games</span>
        <span className={styles.privacyText}>
          Privacy Policy, All rights reserved.
        </span>
      </div>

      {/* Pop-up Overlay */}
      {showRoomManager && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={closeRoomManager}>
              ✖
            </button>
            <RoomManager selectedGame={selectedGame} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
