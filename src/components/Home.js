import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 Layout will be as follows:
 - First section will be open todo lists or btn leading to creation route
 - Second section will be open launch lists or btn leading to creation route
 - Third section will be open ecom lists or btn leading to creation route
 - Fourth section will be open live lists or btn leading to creation route
 - Fifth section will be open ecom live lists or btn leading to creation route
*/

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Header loggedIn={this.props.loggedIn} signOut={this.props.signOut} />
        <main className="main">
          <article className="large-wrapper">
            <section className="section-container todo-section">
              <div className="list-container">
                <h2 className="list-section-title">Todo Lists</h2>
                <div className="active-lists">
                  <Link to="/add-list" className="link-btn">
                    create new list
                  </Link>
                </div>
              </div>
            </section>
            <section className="section-container live-section">
              <div className="list-container">
                <h2 className="list-section-title">launch Lists</h2>
                <div className="active-lists">
                  <Link to="/add-list" className="link-btn">
                    create new list
                  </Link>
                </div>
              </div>
              <div className="list-container">
                <h2 className="list-section-title">live Lists</h2>
                <div className="active-lists">
                  <Link to="/add-list" className="link-btn">
                    create new list
                  </Link>
                </div>
              </div>
            </section>
            <section className="section-container ecom-section">
              <div className="list-container">
                <h2 className="list-section-title">ecom Lists</h2>
                <div className="active-lists">
                  <Link to="/add-list" className="link-btn">
                    create new list
                  </Link>
                </div>
              </div>
              <div className="list-container">
                <h2 className="list-section-title">ecom live Lists</h2>
                <div className="active-lists">
                  <Link to="/add-list" className="link-btn">
                    create new list
                  </Link>
                </div>
              </div>
            </section>
          </article>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;
