import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "tachyons";

function Square(props) {
  return (
    <button className="square shadow-4" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Restart(props) {
  return (
    <button className="restart" onClick={props.onClick}>
      Play Again
    </button>
  );
}

function calculateWinner(squares) {
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
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  renderRestart() {
    return (
      <Restart
        onClick={() => {
          this.setState({
            history: [{ squares: Array(9).fill(null) }],
            xIsNext: true,
            stepNumber: 0,
          });
        }}
      />
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "go to move #" + move : "go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "winner:" + winner;
    } else if (this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = "Next player:" + (this.state.xIsNext ? "X" : "O");
    }
    const playAgain = status === "Draw" || winner ? this.renderRestart() : null;

    return (
      <div>
        <header className="f4 tc b code mb4 mt2">Tic-Tac-Toe</header>
        <div className="game b code">
        <div className="game-board tc">
          <div className="status">{status}</div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <div className="restart mt3">{playAgain}</div>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div></div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
