import React from 'react';
import './App.css';
import Feed from './components/Feed';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hacker News Feed</h1>
        </header>
        <main className="App-body">
          <Feed category="top"/>
        </main>
      </div>
    );
  }
}

export default App;
