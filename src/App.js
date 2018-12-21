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
// import AllLists from "./pages/AllLists";
import Lists from "./pages/views/Lists";
import List from "./pages/views/List";

// User pages
import Profile from "./pages/Profile";

// Config
import "./config/config";

class App extends Component {
  state = {
    loggedIn: true,
    role: "",
    authToken: "",
    resMsg: "",
    listType: ""
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
          { loggedIn: true, authToken: response.code, role: response.role },
          () => {
            sessionStorage.token = response.code;
            window.location.href = "/";
          }
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
        {this.state.loggedIn ? null : <Redirect to="/login" />}

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

        {/* <Route
          path="/all-lists"
          render={() => <AllLists updateListType={this.updateListType} />}
        /> */}

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

        {this.state.loggedIn ? <Footer /> : null}
      </main>
    );
  }
}

export default App;
