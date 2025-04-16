import { useState } from 'react';
import styles from './xoboard.module.css';

const XOBoard = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if (squares[index] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[index] = isXNext ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXNext(!isXNext);
  };

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? "It's a draw!"
    : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className={styles.container}>
      <h2 className={styles.status}>{status}</h2>
      <div className={styles.board}>
        {squares.map((value, i) => (
          <button
            key={i}
            className={styles.cell}
            onClick={() => handleClick(i)}
          >
            {value}
          </button>
        ))}
      </div>
      <button className={styles.restartButton} onClick={() => {
        setSquares(Array(9).fill(null));
        setIsXNext(true);
      }}>
        Restart
      </button>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default XOBoard;
