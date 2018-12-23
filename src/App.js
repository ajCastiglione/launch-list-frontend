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
import Lists from "./pages/views/Lists";
import List from "./pages/views/List";

// User pages
import Profile from "./pages/Profile";
import Users from "./pages/views/Users";
import AddUser from "./pages/AddUser";

// Config
import url from "./config/config";

class App extends Component {
  state = {
    loggedIn: sessionStorage.token ? true : false,
    role: sessionStorage.role ? sessionStorage.role : "",
    authToken: "",
    resMsg: "",
    listType: ""
  };

  componentDidMount() {
    this.checkForToken();
    if (this.state.authToken !== "") {
      this.checkAuth();
    }
  }

  checkForToken = () => {
    return new Promise((resolve, reject) => {
      if (sessionStorage.token) {
        this.setState({ loggedIn: true, authToken: sessionStorage.token });
        resolve(sessionStorage.token);
        return sessionStorage.token;
      } else {
        this.setState({ loggedIn: false });
        return false;
      }
    });
  };

  checkAuth = () => {
    return new Promise((resolve, reject) => {
      fetch(`//${url}/users/me`, {
        headers: {
          "x-auth": sessionStorage.token
        }
      })
        .then(res =>
          res.status === 200
            ? res.json()
            : new Error("Could not validate token")
        )
        .then(res => {
          this.setState({ role: res.user.role });
          sessionStorage.role = res.user.role;
          resolve(res.user.role);
        })
        .catch(e => console.log(e));
    });
  };

  signIn = (email, password) => {
    fetch(`//${url}/users/login`, {
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
          { loggedIn: true, authToken: response.code, role: response.role },
          () => {
            sessionStorage.token = response.code;
            sessionStorage.role = response.role;
            window.location.href = "/";
          }
        );
      })
      .catch(e => this.setState({ resMsg: "Authentication failed!" }));
  };

  signOut = e => {
    e.preventDefault();
    fetch(`//${url}/users/signout`, {
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

  updateListType = type => {
    this.setState({ listType: type });
    sessionStorage.listType = type;
  };

  render() {
    return (
      <main className="App main">
        {this.state.loggedIn ? null : window.location.href.includes(
            "/login"
          ) ? null : (
          <Redirect to="/login" />
        )}

        {this.state.loggedIn ? (
          <Header loggedIn={this.state.loggedIn} signOut={this.signOut} />
        ) : null}

        <Route
          path="/"
          exact
          render={() => (
            <Home
              loggedIn={this.state.loggedIn}
              signOut={this.signOut}
              updateListType={this.updateListType}
              checkForToken={this.checkForToken}
            />
          )}
        />

        <Route
          path="/login"
          exact
          render={() => (
            <Login signIn={this.signIn} resMsg={this.state.resMsg} />
          )}
        />

        <Route
          path="/add-list"
          render={() => <AddList updateListType={this.updateListType} />}
        />

        <Route
          path="/lists/:listType"
          render={() => <Lists listType={this.state.listType} />}
        />

        <Route
          path="/list"
          render={() => <List listType={this.state.listType} />}
        />

        {/* User routes */}

        <Route
          path="/profile"
          render={() => <Profile role={this.state.role} />}
        />

        <Route
          exact
          path="/users"
          render={() =>
            this.state.role === "admin" ? (
              <Users checkAuth={this.checkAuth} />
            ) : (
              <Redirect to="/" />
            )
          }
        />

        <Route
          path="/users/add"
          render={() =>
            this.state.role === "admin" ? (
              <AddUser checkAuth={this.checkAuth} />
            ) : (
              <Redirect to="/" />
            )
          }
        />

        {this.state.loggedIn ? <Footer /> : null}
      </main>
    );
  }
}

export default App;
