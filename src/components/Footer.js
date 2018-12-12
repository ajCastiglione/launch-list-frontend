import React, { Component } from "react";
import logo from "./../logo.png";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = {
  root: {
    flexGrow: 1
  }
};

class Footer extends Component {
  render() {
    const { classes } = this.props;
    const year = new Date().getFullYear();
    return (
      <footer className="footer">
        <div className={`${classes.root} large-wrapper`}>
          <Grid container spacing={24} className="grid-container">
            <Grid item xs={12} sm={6} md={4}>
              <img className="footer-logo" src={logo} alt="logo" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <p>Checklist Organization Application</p>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <p>
                Copyright &copy; {year}.{" "}
                <a href="https://minervawebdevelopment.com">
                  Minerva Web Development
                </a>
              </p>
            </Grid>
          </Grid>
        </div>
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);
