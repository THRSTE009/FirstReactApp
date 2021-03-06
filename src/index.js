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
        <button
            className={"square " + (props.isWinning ? "square--winning" : null)}
                //  If this square has a property named isWinning that is true then change it's class name to "square square--winning".
                // Must have a space between "square" and "square--winning" for CSS.
            onClick={props.onClick}>
            
            {props.value}
        </button>
    );  
}

/// The Board component is a child component of Game. It's purpose is to pass values to and render the nine squares.
class Board extends React.Component {    

    /// Populates the properties for a square.
    renderSquare(i) {
        return (//  Added parentheses so that JS doesn't insert a semicolon after return and break the code.
            //  In React, it�s conventional to use on[Event] names for props which represent events and 
            //  handle[Event] for the methods which handle the events.
            <Square
                //  Whenever you use a loop it is important to provide a unique 'key' attribute otheriwse you get a warning:
                //  "Each child in an array or iterator should have a  unique "key" prop."
                //  The reason is that React uses these keys to track if items were changed, added, or removed.
                //  Rule of thumb if an array can change use a unique ID instead of the index key to avoid bugs.
                //  Source: https://www.telerik.com/blogs/beginners-guide-loops-in-react-jsx

                //  Passing down props (highlighted in teal) from Board (parent) to Square (child): e.g. 'value' and 'onClick':
                //  That props values within the curly brackets are the the property's from Board which are being passed to Square.  NB!!!
                key={"square" + i}             
                value={this.props.squares[i]}   //  Each Square will now receive a value prop that will either be 'x', 'o', or null for empty squares.  
                onClick={() => this.props.onClick(i)}   //  The onClick prop is a function that Square can call when clicked. 
                isWinning={this.props.winningSquares.includes(i)}   // A Square is a winning square if it is included in the winningSquares array.
                />
        );    
    }

    /// Creates an array called squares, with at most three squares, and makes a call to renderSquare to populate each square.
    renderSquares(n) {
        // For-standard loop below:
        let squares = [];
        for (let i = n; i < n + 3; i++) {
            squares.push(this.renderSquare(i));
        }
        return squares;
    }

    /// Sets up a div layout and makes a call to renderSquares to populate the squares that will be contained within this div.
    renderRows(i) {
        return <div className="board-row">{ this.renderSquares(i) }</div>;
    }

    /// Renders to the browser three rows of squares.
    render() {          
        return (            
            <div>
                {this.renderRows(0)}        
                {this.renderRows(3)} 
                {this.renderRows(6)} 
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
            isDescending: true,
        };
    }

 
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

    /// Flip history display order from Descending to Ascending or vice versa.
    sortHistory() {
        this.setState({
            isDescending: !this.state.isDescending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];    //  Changed from always rendering the last move to rendering the currently selected move according to stepNumber.
        const winner = calculateWinner(current.squares);    //returns 'player' and 'line' properties.
        /*  "For each move in the game's history, we create a list item <li> which contains a button <button>. 
         *  The button has a onClick handler which calls  method called this.jumpTo().
         *  A list of the moves that have occurred in the game should be displayed.
        */
        
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + history[move].location :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b> {desc} </b> : desc}
                    </button>
                </li>   // if any button�s move matches Game�s state.stepNumber, return a bold desc, or else just return a regular desc.
            );
        });       
     
        let status;

        if (winner) {   //if winner is NOT null.
            status = 'Winner: ' + winner.player;
        } else if (this.state.stepNumber === 9) {
            status = 'Draw!';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        //  if winner is true, pass winner.line to its winningSquares prop, otherwise pass an empty array.
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winningSquares={winner ? winner.line : []}   
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>

                    <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>                                   
                    <button onClick={() => this.sortHistory()}>
                        Sort by: {this.state.isDescending ? "Descending" : "Ascending"}
                    </button>
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
            //  Keep track of the three winning squares in order to highlight them for challenge #5.
            //  console.log(a + " " + b + " " + c);

            return {player: squares[a], line: [a, b, c]};   //returning the value of the Winner 'squares[a] && the line which contains the winning squares.
        }
    }
    return null;
}
