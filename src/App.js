import React, { useState, useEffect } from 'react';
import './App.css';

const Board = ({ squares, onClick }) => (
  <div className="board">
    {squares.map((value, index) => (
      <button key={index} className="square" onClick={() => onClick(index)}>
        {value}
      </button>
    ))}
  </div>
);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const calculateDraw = (squares) => {
  return squares.every((square) => square !== null);
};

const BotMoveDelay = 500;
const BotPlayer = ({ winner, xIsNext, current, handleClick }) => {
  useEffect(() => {
    const makeBotMove = () => {
      if (!winner && !xIsNext) {
        const emptySquares = current.reduce((acc, value, index) => {
          if (!value) {
            return acc.concat(index);
          }
          return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const botMove = emptySquares[randomIndex];

        setTimeout(() => handleClick(botMove), BotMoveDelay);
      }
    };

    makeBotMove();
  }, [winner, xIsNext, current, handleClick]);

  return null; 
};

const App = () => {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null) }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const current = history[stepNumber].squares;

  const handleClick = (index) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const currentSquare = current.slice();
  
    if (winner || currentSquare[index]) {
      return;
    }
  
    currentSquare[index] = xIsNext ? 'X' : 'O';
  
    setHistory((prevHistory) => [...prevHistory, { squares: currentSquare }]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };
  
  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
    setWinner(null);
  };

  const resetGame = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
    setXIsNext(true);
    setWinner(null);
  };

  useEffect(() => {
    const currentSquares = history[stepNumber].squares;
    setWinner(calculateWinner(currentSquares));
  }, [history, stepNumber]);

  useEffect(() => {
    const draw = calculateDraw(current);
    if (draw) {
      setWinner('Draw');
    }
  }, [current]);

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  useEffect(() => {
    const draw = calculateDraw(current);
    if (draw) {
      setWinner('Draw');
    }
  }, [current]);
  
  return (
    <div className="app">
      <h1>Game XO</h1>
      <div className="game">
        <div className="game-board">
          <Board squares={current} onClick={handleClick} />
        </div>
        <div className="game-info">
          <div className="status">
            {winner ? (
              <div>
                {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}
                <button className="button-reeset" onClick={resetGame}>Restart Game</button>
              </div>
            ) : (
              `Next Player: ${xIsNext ? 'X' : 'O'}`
            )}
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
      <BotPlayer winner={winner} xIsNext={xIsNext} current={current} handleClick={handleClick} />
    </div>
  );
}

export default App;
