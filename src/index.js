import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//  render() returns a React element.
//  This method returns a description of what you want to see on the screen.
//  React developers can use a "JSX" to make React elements easier to write.
//  e.g. <div /> is transformed at build time to React.createElement('div').

//  Any JS expression may be placed within JSX braces.
//  Passing props is how info flows in React apps from prents to children.

/// The Square is a controlled component (by Board) and it renders a single <button>.

//class Square extends React.Component {
//    render() {
function Square(props) {
    return (
        <button className="square"
            onClick={props.onClick}>
            {props.value}    
        </button>
    );  // Board stores the squares state and will pass this value through props.
}

/// The Board component renders 9 squares.
class Board extends React.Component {
    // 'this' refers to the Board component.
    //  Components use state's to remember things. 
    //      --> we want to remember that a square component got clicked and to fill it with an "X" mark.
    //  These states are private to each component that they're defined in.
    //  States are initialized in the components constructors. (obviously)
    constructor(props) {
        super(props);   //  "In JavaScript classes, you need to always call super when defining the constructor of a subclass. 
                        //  All React component classes that have a constructor should start with a super(props) call."
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,  //  each time a player moves this var will be changed to determine which player goes next.
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice(); //.slice() --> creates a copy of the squares array to modify instead of modifying the existing array.
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,   //  flip the boolean var.
        });
    }

    renderSquare(i) {
        return (//  Added parentheses so that JS doesn't insert a semicolon after return and break the code.
            //  In React, it’s conventional to use on[Event] names for props which represent events and 
            //  handle[Event] for the methods which handle the events.
            <Square
                //  pass a prop called 'value' from parent "Board" to a child 'Square' component.
                //  Each Square will now receive a value prop that will either be 'x', 'o', or null for empty squares.
                value={this.state.squares[i]} 
                onClick={() => this.handleClick(i)}
                //  Passing down a fx from Board to the Square.
                //  Square should call this function when a square is clicked.
            />
        );
        
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div>
                <div className="status">{status}</div>
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

//  The Game component renders a board with placeholder values.
class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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
