import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import "./App.css";
// Config
import "./config/config";

class App extends Component {
  state = {
    loggedIn: false,
    authToken: "",
    resMsg: ""
  };

  componentDidMount() {
    this.checkForToken();
  }

  checkForToken = () => {
    if (sessionStorage.token) {
      this.setState({ loggedIn: true, authToken: sessionStorage.token });
      return sessionStorage.token;
    } else {
      this.setState({ loggedIn: false });
      return false;
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
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw Error("Authenticated failed.");
        }
      })
      .then(response => {
        this.setState(
          { loggedIn: true, authToken: response.code },
          () => (sessionStorage.token = response.code)
        );
      })
      .catch(e => this.setState({ resMsg: "Authentication failed!" }));
  };

  signOut = e => {
    e.preventDefault();
    fetch("//localhost:5000/users/signout", {
      method: "DELETE",
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        this.setState({ loggedIn: false, resMsg: response.success }, () =>
          sessionStorage.removeItem("token")
        );
      })
      .catch(e => {
        console.log(e);
        this.setState(
          { loggedIn: false, resMsg: "Signed out successfully" },
          () => sessionStorage.removeItem("token")
        );
      });
  };

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? <Redirect to="/" /> : <Redirect to="/login" />}

        <Route
          path="/"
          exact
          render={() => (
            <Home loggedIn={this.state.loggedIn} signOut={this.signOut} />
          )}
        />

        <Route
          path="/login"
          exact
          render={() => (
            <Login signIn={this.signIn} resMsg={this.state.resMsg} />
          )}
        />
      </div>
    );
  }
}

export default App;
