import React, { Component } from "react";
import ReactDOM from "react-dom";

// Local Modules
import MySnackBar from "../displayMessages/MySnackBar";
import { uptimeUrl } from "../config/config";
import PaginatedTable from "../components/PaginatedTable";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    maxWidth: 450
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 175
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
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
    siteToRemove: null,
    open: false,
    newSiteUrl: "",
    newSiteName: "",
    interval: "",
    email: "",
    tableHeaders: [
      "Website",
      "Status",
      "Monitoring",
      "Time Last Checked",
      "Interval",
      "Notify Email",
      "Website Name",
      "Update"
    ],
    labelWidth: 0
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchMonitors();
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
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

  askToDelete = url => this.setState({ siteToRemove: url, open: true });
  handleClose = () =>
    this.setState({
      open: false,
      siteToRemove: null,
      warning: false,
      failure: false
    });
  handleChange = evt => this.setState({ [evt.target.name]: evt.target.value });

  removeMonitor = () => {
    // Remove monitor - update list - display new results
    fetch(`${uptimeUrl}/remove`, {
      method: "DELETE",
      headers: {
        "x-auth": sessionStorage.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ website: this.state.siteToRemove })
    })
      .then(res => {
        this.fetchMonitors();
        this.handleClose();
      })
      .catch(e => console.log(e));
  };

  generateSelectItems = () => {
    let itemsArr = [];
    for (let i = 5; i <= 60; i += 5) {
      itemsArr.push(
        <MenuItem value={i} key={i}>
          {i}
        </MenuItem>
      );
    }
    return itemsArr;
  };

  addWebsite = () => {
    let { newSiteUrl, newSiteName, interval, email } = this.state;
    if (!newSiteUrl || !interval || !email)
      return this.setState({
        warning: true,
        msg: "Please Fill Out The Required Fields!"
      });
    fetch(`${uptimeUrl}/add-website`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth": sessionStorage.token
      },
      body: JSON.stringify({
        url: newSiteUrl,
        settings: { intervalType: "min", interval },
        email,
        websiteName: newSiteName
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.name === "ValidationError")
          return this.setState({ failure: true, msg: res.message });
        else this.fetchMonitors();
      })
      .catch(e => {
        console.log(e);
      });
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
              onClose={this.handleClose}
            />
          </div>
        ) : null}
      </div>
    );

    const modal = (
      <Modal
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        open={this.state.open}
      >
        <div className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            Are you sure you want to remove this website from your active
            monitors?
          </Typography>
          <div className="btn-container">
            <Button
              color="secondary"
              variant="contained"
              onClick={this.removeMonitor}
            >
              Remove The Site
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleClose}
            >
              Keep The Site
            </Button>
          </div>
        </div>
      </Modal>
    );

    const addMonitor = (
      <React.Fragment>
        <h2 className="section-title">Add website to monitor</h2>
        {this.state.failure || this.state.warning ? (
          <MySnackBar
            variant={
              this.state.warning
                ? "warning"
                : this.state.failure
                ? "error"
                : null
            }
            className={classes.margin}
            message={this.state.msg}
            onClose={this.handleClose}
          />
        ) : null}
        <div className="create-monitor">
          <TextField
            label="URL Of The Website"
            className={classes.textField}
            value={this.state.newSiteUrl}
            name="newSiteUrl"
            onChange={this.handleChange}
            margin="normal"
            required
          />
          <TextField
            label="Where To Email Alerts"
            className={classes.textField}
            value={this.state.email}
            name="email"
            onChange={this.handleChange}
            margin="normal"
            required
          />
          <TextField
            label="The Name For The Monitor"
            className={classes.textField}
            value={this.state.newSiteName}
            name="newSiteName"
            onChange={this.handleChange}
            margin="normal"
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="interval-min"
            >
              Interval - Minutes
            </InputLabel>
            <Select
              value={this.state.interval}
              onChange={this.handleChange}
              input={
                <OutlinedInput
                  labelWidth={this.state.labelWidth}
                  name="interval"
                  id="interval-min"
                  required
                />
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.generateSelectItems()}
            </Select>
          </FormControl>
        </div>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => this.addWebsite()}
        >
          Start monitoring
        </Button>
      </React.Fragment>
    );

    return (
      <article className="uptime-article">
        {searchBar}
        {modal}
        <section className="section-container table">
          {isLoaded ? (
            <React.Fragment>
              <h2 className="section-title">Websites being monitored</h2>
              <PaginatedTable
                monitors={this.state.filteredMonitors}
                header={this.state.tableHeaders}
                askToDelete={this.askToDelete}
              />
            </React.Fragment>
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
        <section className="section-container add-website">
          {addMonitor}
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(Monitors);
