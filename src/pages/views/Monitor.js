import React, { Component } from "react";
import { uptimeUrl } from "../../config/config";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  }
});

class Monitor extends Component {
  state = {
    id: "",
    site: {},
    isLoaded: false,
    url: "",
    protocol: "http",
    interval: null,
    intervalType: null,
    adminEmail: "",
    monitorName: ""
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    if (!id) return (window.location.href = "/uptime");
    this.setState({ id }, () => this.fetchUptime());
  }

  fetchUptime = () => {
    let id = this.state.id;
    fetch(`${uptimeUrl}/site/${id}`, {
      headers: { "x-auth": sessionStorage.token }
    })
      .then(res => res.json())
      .then(site => this.setState({ isLoaded: true, site }))
      .catch(e => console.log(e));
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { isLoaded, site } = this.state;
    const { classes } = this.props;
    const content = isLoaded ? (
      <section className="section-container">
        <h1>Currently editing {this.state.site.url}</h1>
        <Grid container spacing={24} className="grid-container">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="protocol">Protocol</InputLabel>
                <Select
                  value={this.state.protocol}
                  onChange={this.handleChange}
                  inputProps={{
                    name: "protocol",
                    id: "protocol"
                  }}
                >
                  <MenuItem value="http">HTTP</MenuItem>
                  <MenuItem value="https">HTTPS</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <TextField
                label="URL"
                name="url"
                className={`${classes.textField} input-txt`}
                value={this.state.site.url}
                onChange={this.handleChange}
                margin="normal"
              />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
        </Grid>
      </section>
    ) : (
      <div className="spinner" />
    );

    return (
      <article className="monitor-single">
        {isLoaded ? null : (
          <h1>Please wait while we load the requested site...</h1>
        )}
        {content}
      </article>
    );
  }
}

export default withStyles(styles)(Monitor);
