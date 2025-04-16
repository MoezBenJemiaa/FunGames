import React from "react";
import styles from "./Home.module.css";
import Header from "../header/header";
import GameCard from "../game/gamecard";
import backgroundImage from "../assets/Village by the lake.jpg"; // adjust path if needed

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
  return (
    <div className={styles.container}>
      <Header className={styles.heroBackground} />

      <section
        className={`${styles.section} ${styles.heroBackground}`}
        id="home"
      >
        <h1>Welcome to Our Site</h1>
        <p>This is the hero section with a quick intro.</p>
      </section>

      <ScrollingBar />

      <section className={styles.section} id="about">
        <h2>What We Offer</h2>
        <p>Explore our featured games below:</p>
        <div className={styles.cardContainer}>
          <GameCard
            title="Space Blaster"
            description="Battle in space against endless alien waves."
            imageUrl="https://via.placeholder.com/150"
          />
          <GameCard
            title="Jungle Jump"
            description="Adventure through the jungle in this platformer."
            imageUrl="https://via.placeholder.com/150"
          />
          <GameCard
            title="Puzzle Master"
            description="Solve tricky puzzles and level up your brain."
            imageUrl="https://via.placeholder.com/150"
          />
        </div>
      </section>

      <ScrollingBar />

      <section className={styles.section} id="contact">
        <h2>Contact Us</h2>
        <p>Get in touch with us by filling out the form below.</p>

        <form
          className={styles.registerForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Full Name"
            className={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
