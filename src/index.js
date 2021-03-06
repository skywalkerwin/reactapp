import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const winstyle = {
    backgroundColor: "yellow"
  };

  return (
    <button
      className="square"
      style={props.winningsquares ? winstyle : null}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningsquares =
      this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningsquares={winningsquares}
      />
    );
  }

  createTable = () => {
    let table = [];
    for (let i = 0; i < 3; i++) {
      let children = [];
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(i * 3 + j));
      }
      table.push(<div className="board-row"> {children} </div>);
    }
    return table;
  };

  render() {
    return <div>{this.createTable()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coords: Array(2).fill(-1)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      reverse: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coord = [Math.floor(i / 3), i % 3];
    if (calculateWinner(squares) || squares[i]) {
      console.log("WINNER!!!!!!!!!");
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    console.log(squares);

    this.setState({
      history: history.concat([
        {
          squares: squares,
          coords: coord
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  swapOrder() {
    this.setState({
      reverse: !this.state.reverse
    });
  }

  render() {
    // const rev = this.state.reverse;
    // const history = rev ? this.state.history.reverse() : this.state.history;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const rev = this.state.reverse;
    const moves = history.map((step, move) => {
      //const num = rev ? this.state.stepNumber - move : move;
      // console.log("num: " + num);
      // console.log("move " + move);
      // console.log("        ");
      const desc = move
        ? "Go to Move #" + move + " ( " + history[move].coords + " )"
        : "Go to game start";
      const stepcheck = this.state.stepNumber === move;
      // console.log(stepcheck)
      return (
        <li key={move}>
          <button key={move} onClick={() => this.jumpTo(move)}>
            {stepcheck ? <b> {desc} </b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    if (this.state.stepNumber == 9 && !winner) {
      status = "DRAW!";
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner && winner.winningsquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{!rev ? moves : moves.reverse()}</ol>
        </div>
        <div className="swap-button">
          <button onClick={() => this.swapOrder()}>Swap Button</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningsquares: lines[i]
      };
    }
  }
  return null;
}
