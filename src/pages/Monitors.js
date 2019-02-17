import React, { Component } from "react";

// Local Modules
import MySnackBar from "../displayMessages/MySnackBar";
import { uptimeUrl } from "../config/config";
import PaginatedTable from "../components/PaginatedTable";

// UI Lib
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  paper: {
    position: "absolute",
    width: "100%",
    "max-width": "450px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: "40%",
    left: 0,
    right: 0,
    margin: "auto"
  }
});

class Monitors extends Component {
  state = {
    isLoaded: false,
    noMatch: false,
    monitors: [],
    filteredMonitors: [],
    originalList: [],
    tableHeaders: [
      "Website",
      "Status",
      "Monitoring",
      "Time Last Checked",
      "Interval",
      "Notify Email",
      "Website Name",
      "Update"
    ]
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchMonitors();
  }

  fetchMonitors = () => {
    fetch(`//${uptimeUrl}`, {
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res => res.json())
      .then(monitors => {
        this.setState({
          monitors,
          filteredMonitors: monitors,
          originalList: monitors,
          isLoaded: true
        });
      })
      .catch(e => this.setState({ failToFetch: true }));
  };

  handleSearch = e => {
    let { value } = e.target;
    let { monitors } = this.state;
    let regex = new RegExp(value, "i");
    let temp = [];
    monitors.map(monitor => {
      if (monitor.url.match(regex) && value) {
        temp.push(monitor);
        return this.setState({ filteredMonitors: temp, noMatch: false });
      } else if (temp.length === 0 && value) {
        return this.setState({
          filteredMonitors: this.state.originalList,
          noMatch: true,
          msg: `No results for ${value}`
        });
      } else if (!value) {
        return this.setState({
          noMatch: false,
          filteredMonitors: this.state.originalList
        });
      } else return false;
    });
  };

  formatDate = date => {
    return date
      ? `${new Date(date).toLocaleTimeString()} ${new Date(
          date
        ).toLocaleDateString()}`
      : "Never Been Monitored";
  };

  render() {
    const { classes } = this.props;
    const { isLoaded } = this.state;

    const searchBar = (
      <div className="search-bar-container">
        <input
          id="search"
          placeholder="Filter by url..."
          type="search"
          onChange={this.handleSearch}
          autoComplete="off"
        />

        {this.state.noMatch ? (
          <div className="warning">
            <MySnackBar
              variant="warning"
              className={classes.margin}
              message={this.state.msg}
            />
          </div>
        ) : null}
      </div>
    );
    return (
      <article className="uptime-article">
        {searchBar}
        <section className="section-container table">
          {isLoaded ? (
            <PaginatedTable
              monitors={this.state.filteredMonitors}
              header={this.state.tableHeaders}
            />
          ) : this.state.failToFetch ? (
            <div className="error">
              <h1>Server Unresponsive</h1>
              <p>
                If this error persists, please contact a systems administrator.
              </p>
            </div>
          ) : (
            <div className="spinner" />
          )}
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(Monitors);
