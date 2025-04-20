import React from "react";
import styles from "./GameCard.module.css";

const GameCard = ({ image, title, onPlay }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.title}>{title}</div>
      <p className={styles.playButton} onClick={onPlay}>Play</p>
    </div>
  );
};

export default GameCard;
