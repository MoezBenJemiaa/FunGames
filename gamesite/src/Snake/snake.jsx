import React, { useRef, useEffect, useState } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const animationRef = useRef();
  const lastUpdateTimeRef = useRef(0);
  const speed = 100;

  const snakeRef = useRef([]);
  const foodRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef();
  const scoreRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const box = 32;
    const columnCount = Math.floor(canvas.width / box);
    const rowCount = Math.floor(canvas.height / box);

    snakeRef.current = [
        { x: 9 * box, y: 10 * box },
        { x: 8 * box, y: 10 * box },
        { x: 7 * box, y: 10 * box },
      ];
    directionRef.current = 'RIGHT';
      
    foodRef.current = {
      x: Math.floor(Math.random() * columnCount) * box,
      y: Math.floor(Math.random() * rowCount) * box,
    };

    function direction(event) {
      const d = directionRef.current;
      if (event.key === 'ArrowLeft' && d !== 'RIGHT') directionRef.current = 'LEFT';
      else if (event.key === 'ArrowUp' && d !== 'DOWN') directionRef.current = 'UP';
      else if (event.key === 'ArrowRight' && d !== 'LEFT') directionRef.current = 'RIGHT';
      else if (event.key === 'ArrowDown' && d !== 'UP') directionRef.current = 'DOWN';
    }

    function collision(head, array) {
      return array.some(segment => head.x === segment.x && head.y === segment.y);
    }

    function draw(currentTime) {
        animationRef.current = requestAnimationFrame(draw);
      
        if (currentTime - lastUpdateTimeRef.current < speed) return;
        lastUpdateTimeRef.current = currentTime;
      
        const snake = snakeRef.current;
        const food = foodRef.current;
        const d = directionRef.current;
      
        // Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // Background color
        ctx.fillStyle = '#fef9e7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      
        // Shadow aura for the entire snake
        // Smaller shadow aura for the entire snake
        // Directional shadow (top and right only)
        snake.forEach(segment => {
            for (let y = 0; y <= 1; y++) {
              for (let x = -1; x <= 0; x++) {
                const cellX = segment.x + x * box;
                const cellY = segment.y + y * box;
                const dist = Math.sqrt(x * x + y * y);
          
                if (
                  cellX >= 0 && cellX < canvas.width &&
                  cellY >= 0 && cellY < canvas.height &&
                  dist <= 1.5
                ) {
                  ctx.fillStyle = `rgba(0, 0, 0, ${0.08 - dist * 0.03})`;
                  ctx.fillRect(cellX, cellY, box, box);
                }
              }
            }
          });
  
      
        // Score display
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Comic Sans MS';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, 40);
      
        // Draw snake
        snake.forEach((segment, i) => {
          ctx.fillStyle = i === 0 ? '#7ED957' : '#A9F548';
          ctx.strokeStyle = '#5EBD3E';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(segment.x, segment.y, box, box, 8);
          ctx.fill();
          ctx.stroke();
        });
      
        // Draw food (emoji)
        ctx.font = `${box}px Comic Sans MS`;
        ctx.fillText('🍎', food.x + 4, food.y + box);
      
        // Snake movement
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        if (d === 'LEFT') snakeX -= box;
        if (d === 'UP') snakeY -= box;
        if (d === 'RIGHT') snakeX += box;
        if (d === 'DOWN') snakeY += box;
      
        // Snake eats food
        if (snakeX === food.x && snakeY === food.y) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          foodRef.current = {
            x: Math.floor(Math.random() * columnCount) * box,
            y: Math.floor(Math.random() * rowCount) * box,
          };
        } else {
          snake.pop();
        }
      
        const newHead = { x: snakeX, y: snakeY };
      
        // Collision check
        if (
          snakeX < 0 || snakeX >= canvas.width ||
          snakeY < 0 || snakeY >= canvas.height ||
          collision(newHead, snake)
        ) {
          setGameOver(true);
          cancelAnimationFrame(animationRef.current);
          return;
        }
      
        snake.unshift(newHead);
      }
      
    window.addEventListener('keydown', direction);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('keydown', direction);
    };
  }, []);

  const handleReplay = () => window.location.reload();
  const handleHome = () => window.location.href = '/';

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      {gameOver && (
        <div className={styles.popup}>
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <div className={styles.buttons}>
            <button onClick={handleHome}>🏠 Home</button>
            <button onClick={handleReplay}>🔄 Replay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
