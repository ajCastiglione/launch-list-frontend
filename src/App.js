import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.css";

// Sections
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";

// Pages
import Home from "./pages/Home";
import AddList from "./pages/AddList";

// Config
import "./config/config";

class App extends Component {
  state = {
    loggedIn: true,
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
        this.setState({ loggedIn: true, authToken: response.code }, () => {
          sessionStorage.token = response.code;
          window.location.href = "/";
        });
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
        this.setState({ loggedIn: false, resMsg: response.success }, () =>
          sessionStorage.removeItem("token")
        );
      })
      .catch(e => {
        this.setState(
          { loggedIn: false, resMsg: "Signed out successfully" },
          () => sessionStorage.removeItem("token")
        );
      });
  };

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? null : <Redirect to="/login" />}

        {this.state.loggedIn ? (
          <Header loggedIn={this.state.loggedIn} signOut={this.signOut} />
        ) : null}

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

        <Route path="/add-list" component={AddList} />

        {this.state.loggedIn ? <Footer /> : null}
      </div>
    );
  }
}

export default App;
