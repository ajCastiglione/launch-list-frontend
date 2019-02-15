import React, { Component } from "react";
import MySnackBar from "../displayMessages/MySnackBar";
import { uptimeUrl } from "../config/config";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

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
    originalList: []
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
      .catch(e => console.log(e));
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
    const monitors = isLoaded
      ? this.state.filteredMonitors.map(el => (
          <TableRow key={el._id}>
            <TableCell component="th" scope="row">
              {el.url}
            </TableCell>
            <TableCell>{el.siteStatus ? el.siteStatus : "No Data"}</TableCell>
            <TableCell>{el.status}</TableCell>
            <TableCell>{this.formatDate(el.timeLastChecked)}</TableCell>
            <TableCell>{`${el.settings.interval} ${
              el.settings.intervalType
            }`}</TableCell>
            <TableCell>{el.adminEmail}</TableCell>
            <TableCell>{el.websiteName ? el.websiteName : el.url}</TableCell>
          </TableRow>
        ))
      : null;
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
      <article className="section-container uptime-section">
        {searchBar}
        <section className="table">
          {isLoaded ? (
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Website</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Monitoring</TableCell>
                    <TableCell>Time Last Checked</TableCell>
                    <TableCell>Interval</TableCell>
                    <TableCell>Notify Email</TableCell>
                    <TableCell>Website Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{monitors}</TableBody>
              </Table>
            </Paper>
          ) : (
            <div className="spinner" />
          )}
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(Monitors);
