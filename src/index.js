import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//reference for tutorial challenge solutions:   https://medium.com/@thekevinwang/react-%EF%B8%8F-tic-tac-toe-%EF%B8%8F%E2%83%A3-extras-88e68f025772

//  render() returns a React element.
//  This method returns a description of what you want to see on the screen.
//  React developers can use a "JSX" to make React elements easier to write.
//  e.g. <div /> is transformed at build time to React.createElement('div').

//  Any JS expression may be placed within JSX braces.
//  Passing props is how info flows in React apps from prents to children.

/// The Square is a FUNCTION COMPONENT which takes props as input and returns what should be rendered.
//  The game's state is stored in the parent component 'XXX' instead of in each Square.
//  The Board component can tell each Square what to display by passing a prop.
function Square(props) {
    return (
        //  When this square button is clicked, Square calls the Board property Onclick.
        <button className="square"
            onClick={props.onClick}>   
            {props.value}       
        </button>
    );  
}

/// The Board component renders 9 squares.
class Board extends React.Component {    
    renderSquare(i) {
        return (//  Added parentheses so that JS doesn't insert a semicolon after return and break the code.
            //  In React, it’s conventional to use on[Event] names for props which represent events and 
            //  handle[Event] for the methods which handle the events.
            <Square
                //  Passing down two props (highlighted in teal) from Board (parent) to Square (child): 'value' and 'onClick'.
                value={this.props.squares[i]}   //  Each Square will now receive a value prop that will either be 'x', 'o', or null for empty squares.  
                onClick={() => this.props.onClick(i)}   //  The onClick prop is a function that Square can call when clicked. 
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

//  The Game component is the top-level component which renders a board with placeholder values.
//  To enable Square and Board to communicate with each other we declare the shared state in their parent component 'Game'.
//  Game has full control over the Board's data.
class Game extends React.Component {
    // 'this' refers to the Game component.
    //  Components use state's to remember things. 
    //      --> we want to remember that a square component got clicked and to fill it with an "X" mark.
    //  These states are private to each component that they're defined in.
    //  States are initialized in the components constructors. (obviously)
    constructor(props) {
        super(props);   //  "In JavaScript classes, you need to always call super when defining the constructor of a subclass. 
                        //  All React component classes that have a constructor should start with a super(props) call."
        this.state = {
            history: [{
                squares: Array(9).fill(null),      
            }],
            stepNumber: 0,
            xIsNext: true,  //  each time a player moves this var will be changed to determine which player goes next.  
            
        };
    }

    //the properties below will update after every move.
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //  Changed so that if we go back in time and then make a new move from that point, 
            //  then we disregard all the future history that would now become incorrect.
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //.slice() --> creates a copy of the squares array to modify instead of modifying the existing array.

        if (calculateWinner(squares) || squares[i]) {   //  if there is a winner or the square is already filled then return.
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{  //  concat() does NOT mutate the original array unlike push().
                squares: squares,
                location: calculateLocation(i),
            }]),
            stepNumber: history.length, //line added to ensure that we do not get stuck showing the same move after a new one has been made.
            xIsNext: !this.state.xIsNext,   //  flip the boolean var.  
            
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,   //  update stepNumber.
            xIsNext: (step % 2) === 0,  //  assign xIsNext to true if the step is even.
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];    //  Changed from always rendering the last move to rendering the currently selected move according to stepNumber.
        const winner = calculateWinner(current.squares);
        /*  "For each move in the game's history, we create a list item <li> which contains a button <button>. 
         *  The button has a onClick handler which calls  method called this.jumpTo().
         *  A list of the moves that have occurred in the game should be displayed.
        */
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + history[move].location:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b> {desc} </b> : desc}                       
                    </button>
                </li>   // if any button’s move matches Game‘s state.stepNumber, return a bold desc, or else just return a regular desc.
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateLocation(i) {
    let x, y;
    if (i === 0 || i === 3 || i === 6) {
        x = 0;
    } else if (i === 1 || i === 4 || i === 7) {
        x = 1;
    } else {
        x = 2;
    }

    if (i === 0 || i === 1 || i === 2) {
        y = 0;
    } else if (i === 3 || i === 4 || i === 5) {
        y = 1;
    } else {
        y = 2;
    }
    return '(' + x + ', ' + y +')';
}

///"Given an array of 9 squares, this function will check for a winner and return 'X', 'O', or null as appropriate."
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
