import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <main className="main">
          <article className="large-wrapper">
            <h1>Log in to view your open checklists or create some!</h1>
          </article>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;
