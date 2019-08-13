import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import './App.css';

import Feed from './components/Feed';
import Login from "./components/Login";
import PostDetails from "./components/PostDetails";
import LoginHandler from "./components/handlers/LoginHandler";
import LogoutHandler from "./components/handlers/LogoutHandler";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <h2 className="App-title">
              <Link to={"/"}>Hacker News Feed</Link>
            </h2>
            {/*<Login />*/}
          </header>
          <main className="App-body">
            <Route exact path="/" component={Feed} />
            <Route path="/post/:id" component={PostDetails} />
            <Route path="/logout" component={LogoutHandler} />
            <Route path="/auth/github/:hack" component={LoginHandler} />
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
