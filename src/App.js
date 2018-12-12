import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Login from "./components/Login";

import "./App.css";

class App extends Component {
  state = {
    loggedIn: false,
    authToken: ""
  };

  componentDidMount() {
    this.checkForToken();
  }

  checkForToken = () => {
    if (sessionStorage.token) {
      console.log("token found");
      this.setState({ loggedIn: true, authToken: sessionStorage.token });
    } else {
      this.setState({ loggedIn: false });
    }
  };

  signIn = (email, password) => {
    fetch("//localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(response =>
        this.setState(
          { loggedIn: true, authToken: response.code },
          () => (sessionStorage.token = response.code)
        )
      )
      .catch(e => console.log(e));
    // console.log(email, password);
  };

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? <Redirect to="/" /> : <Redirect to="/login" />}

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
