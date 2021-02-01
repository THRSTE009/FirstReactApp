import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//  render() returns a React element.
//  This method returns a description of what you want to see on the screen.
//  React developers can use a "JSX" to make React elements easier to write.
//  e.g. <div /> is transformed at build time to React.createElement('div').

//  Any JS expression may be placed within JSX braces.
//  Passing props is how info flows in React apps from prents to children.

/// The Square component renders a single <button>.
class Square extends React.Component {

    //  Components use state's to remember things. 
    //      --> we want to remember that a square component got clicked and to fill it with an "X" mark.
    //  These states are private to each component that they're defined in.
    //  States are initialized in the components constructors. (obviously)
    constructor(props) {
        super(props);   //  "In JavaScript classes, you need to always call super when defining the constructor of a subclass. 
                        //  All React component classes that have a constructor should start with a super(props) call."
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <button className="square" onClick={() => alert('click')}>
                { this.props.value  }   
            </button>
        );  //  displays the value prop for this square.
    }
}

/// The Board component renders 9 squares.
class Board extends React.Component {
    renderSquare(i) {
        return <Square value={i} />;    //pass a prop called 'value' from parent "Noard" to a child 'Square' component.
    }

    render() {
        const status = 'Next player: X';

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
