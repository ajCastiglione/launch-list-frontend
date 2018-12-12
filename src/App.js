import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Login from "./components/Login";

import "./App.css";

class App extends Component {
  state = {
    loggedIn: false
  };

  signIn = (email, password) => {
    console.log(email, password);
  };

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? null : <Redirect to="/login" />}

        <Route
          path="/login"
          exact
          render={() => <Login signIn={this.signIn} />}
        />
      </div>
    );
  }
}

export default App;
