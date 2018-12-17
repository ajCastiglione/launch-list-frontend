import React, { Component } from "react";
import { Link } from "react-router-dom";

// UI Lib
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class AllLists extends Component {
  state = {
    all_lists: [],
    todo_list: [],
    launch_list: [],
    live_list: [],
    ecom_list: [],
    ecom_live_list: [],
    listsAcquired: false,
    listType: ""
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
          if (temp.length >= 5) temp = temp.slice(0, 5);
          return this.setState({ [el.type]: temp });
        });

        let allStateLists = [
          {
            title: "Todo Lists",
            array: this.state.todo_list,
            url: "all-todos",
            type: "todo_list"
          },
          {
            title: "Launch Lists",
            array: this.state.launch_list,
            url: "all-launch",
            type: "launch_list"
          },
          {
            title: "Live Lists",
            array: this.state.live_list,
            url: "all-live",
            type: "live_list"
          },
          {
            title: "Ecommerce Lists",
            array: this.state.ecom_list,
            url: "all-ecom",
            type: "ecom_list"
          },
          {
            title: "Ecommerce Live Lists",
            array: this.state.ecom_live_list,
            url: "all-ecom-live",
            type: "ecom_live_list"
          }
        ];
        this.setState({ listsAcquired: true, all_lists: allStateLists });
      })
      .catch(e => console.error(e));
  };

  handleMO = type => {
    this.props.updateListType(type);
  };

  render() {
    const allListTypes = this.state.listsAcquired ? (
      this.state.all_lists.map((arr, index) => (
        <div className="list-container" key={`list-container-${index}`}>
          <h2 className="list-section-title">{arr.title}</h2>
          <div className="active-lists">
            {arr.array.length === 0 ? (
              <p className="empty-lists">
                Looks like there aren't any lists to display for this section.{" "}
                <Link to="/add-list" className="link-btn">
                  Go here to generate a new list!
                </Link>
              </p>
            ) : (
              arr.array.map((el, idx) => (
                <div className={`${arr.type}-info`} key={`${arr.type}-${idx}`}>
                  <Grid container spacing={24} className="lists-info-grid">
                    <Grid item xs={12} md={6}>
                      <h2 className="list-item-title">
                        {el.listName} -{" "}
                        <small>
                          {el.completed ? "Completed" : "Incomplete"}
                        </small>
                      </h2>
                      <p>Items: {el.items.length} </p>
                    </Grid>
                    <Grid item xs={12} md={6} className="list-date">
                      {el.createdAt
                        ? `${new Date(el.createdAt).getMonth()}/${new Date(
                            el.createdAt
                          ).getDate() + 1}/${new Date(
                            el.createdAt
                          ).getFullYear()}`
                        : "Date not found"}
                    </Grid>
                  </Grid>
                </div>
              ))
            )}
            {arr.array.length === 0 ? null : (
              <Link
                className="link-btn"
                to={`/lists/${arr.url}`}
                onMouseOver={() => this.handleMO(arr.type)}
              >
                view all {arr.title}
              </Link>
            )}
          </div>
        </div>
      ))
    ) : (
      <p className="no-lists">
        Looks like there aren't any lists to display for all sections.{" "}
        <Link to="/add-list" className="link-btn">
          Go here to generate a new list!
        </Link>
      </p>
    );

    return (
      <React.Fragment>
        <article className="all-lists-article large-wrapper">
          <section className="section-container all-lists-section">
            {allListTypes}
          </section>
        </article>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AllLists);
