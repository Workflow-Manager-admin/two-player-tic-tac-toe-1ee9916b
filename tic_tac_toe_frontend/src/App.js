import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette from requirements
const COLORS = {
  primary: '#1976d2',    // Blue
  secondary: '#424242',  // Dark Gray
  accent: '#ffca28',     // Orange/Accent
};

const BOARD_SIZE = 3;

// PUBLIC_INTERFACE
function App() {
  // 'X' goes first; array of 9 - null, 'X', or 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Win/draw detection side effect
  useEffect(() => {
    const winnerVal = calculateWinner(board);
    setWinner(winnerVal);

    // Draw only if no winner and all cells filled
    if (!winnerVal && board.every(cell => cell)) {
      setDraw(true);
    } else {
      setDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    // Don't allow play after win or draw, or on filled square
    if (board[idx] || winner || draw) return;

    const nextBoard = board.slice();
    nextBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext(!isXNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setDraw(false);
  }

  let status;
  if (winner) {
    status = (
      <span>
        Winner: <span style={{color: COLORS.primary, fontWeight: 700}}>{winner}</span>
      </span>
    );
  } else if (draw) {
    status = <span>It's a <span style={{ color: COLORS.accent, fontWeight: 700 }}>Draw!</span></span>;
  } else {
    status = (
      <span>
        Turn: <span style={{
          color: isXNext ? COLORS.primary : COLORS.secondary, fontWeight: 700
        }}>{isXNext ? 'X' : 'O'}</span>
      </span>
    );
  }

  return (
    <div className="ttt-app-bg">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
      </header>
      <main>
        <div className="ttt-board-container">
          <Board
            squares={board}
            onSquareClick={handleSquareClick}
            winner={winner}
            winLine={winner ? getWinLine(board) : null}
          />
        </div>
        <button className="ttt-btn-restart" onClick={handleRestart}>
          Restart Game
        </button>
        <div className="ttt-footer">
          <span className="ttt-footer-accent">
            Two Player &middot; Modern &middot; Minimal
          </span>
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winner, winLine }) {
  // Create 3x3 grid, visual highlight for win line
  function renderSquare(idx) {
    let highlight = winLine && winLine.includes(idx) ? 'ttt-square-highlight' : '';
    return (
      <button
        key={idx}
        className={`ttt-square ${highlight}`}
        onClick={() => onSquareClick(idx)}
        disabled={Boolean(squares[idx]) || winner}
        aria-label={squares[idx] ? `Cell ${idx+1}, ${squares[idx]}` : `Cell ${idx+1}, empty`}
      >
        {squares[idx]}
      </button>
    );
  }

  return (
    <div className="ttt-board">
      {[...Array(BOARD_SIZE)].map((_, row) => (
        <div className="ttt-board-row" key={row}>
          {[...Array(BOARD_SIZE)].map((_, col) => {
            const idx = row * BOARD_SIZE + col;
            return renderSquare(idx);
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  // All possible win lines by index
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6],          // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// Get the winning line indices, for highlight
function getWinLine(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;
