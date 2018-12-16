import React, { Component } from "react";
import { Link } from "react-router-dom";

class AllLists extends Component {
  render() {
    return (
      <main className="main">
        <article className="all-lists-article large-wrapper">
          <section className="section-container all-lists-section">
            <div className="list-container">
              <h2 className="list-section-title">Todo Lists</h2>
              <div className="active-lists">
                <p className="empty-lists">
                  Looks like there aren't any lists to display for this section.{" "}
                  <Link to="/add-list" className="link-btn">
                    Go here to generate a new list!
                  </Link>
                </p>
              </div>
            </div>
          </section>
          <section className="section-container live-section">
            <div className="list-container">
              <h2 className="list-section-title">launch Lists</h2>
              <div className="active-lists">
                <p className="empty-lists">
                  Looks like there aren't any lists to display for this section.{" "}
                  <Link to="/add-list" className="link-btn">
                    Go here to generate a new list!
                  </Link>
                </p>
              </div>
            </div>
            <div className="list-container">
              <h2 className="list-section-title">live Lists</h2>
              <div className="active-lists">
                <p className="empty-lists">
                  Looks like there aren't any lists to display for this section.{" "}
                  <Link to="/add-list" className="link-btn">
                    Go here to generate a new list!
                  </Link>
                </p>
              </div>
            </div>
          </section>
          <section className="section-container ecom-section">
            <div className="list-container">
              <h2 className="list-section-title">ecommerce Lists</h2>
              <div className="active-lists">
                <p className="empty-lists">
                  Looks like there aren't any lists to display for this section.{" "}
                  <Link to="/add-list" className="link-btn">
                    Go here to generate a new list!
                  </Link>
                </p>
              </div>
            </div>
            <div className="list-container">
              <h2 className="list-section-title">ecommerce live Lists</h2>
              <div className="active-lists">
                <p className="empty-lists">
                  Looks like there aren't any lists to display for this section.{" "}
                  <Link to="/add-list" className="link-btn">
                    Go here to generate a new list!
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
    );
  }
}

export default AllLists;
