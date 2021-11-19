import React from 'react';
import './App.scss';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="hello">
                    Hello Booster !
                </h1>
                <h3 className='page'>current page is <span><h2><%= pageName %></h2></span></h3>
            </header>
        </div>
    );
}

export default App;
