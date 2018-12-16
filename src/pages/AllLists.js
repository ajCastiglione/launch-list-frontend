import React, { Component } from "react";
import { Link } from "react-router-dom";

class AllLists extends Component {
  state = {
    todo_list: [],
    launch_list: [],
    live_list: [],
    ecom_list: [],
    ecom_live_list: [],
    listsAcquired: false
  };

  componentDidMount() {
    this.getLists();
  }

  getLists = () => {
    fetch("//localhost:5000/lists", {
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res =>
        res.status === 200
          ? res.json()
          : new Error("Could not authenticate and acquire lists.")
      )
      .then(res => {
        res.lists.map((el, idx) => {
          let temp = this.state[el.type];
          temp.push(el);
          return this.setState({ [el.type]: temp });
        });
        this.setState({ listsAcquired: true });
      })
      .catch(e => console.error(e));
  };

  render() {
    return (
      <main className="main">
        <article className="all-lists-article large-wrapper">
          <section className="section-container all-lists-section">
            <div className="list-container">
              <h2 className="list-section-title">Todo Lists</h2>
              <div className="active-lists">
                {this.state.listsAcquired ? (
                  this.state.todo_list.map((el, idx) => <h2>{el.listName}</h2>)
                ) : (
                  <p className="empty-lists">
                    Looks like there aren't any lists to display for this
                    section.{" "}
                    <Link to="/add-list" className="link-btn">
                      Go here to generate a new list!
                    </Link>
                  </p>
                )}
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
