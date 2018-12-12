import React, { Component } from "react";
import logo from "./../logo.png";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    "align-items": "center"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Header extends Component {
  state = {
    btnText: "Login"
  };

  componentDidMount() {
    if (this.props.loggedIn) {
      this.setState({ btnText: "Logout" });
    } else {
      this.setState({ btnText: "Login" });
    }
  }

  render() {
    const { classes } = this.props;
    const { btnText } = this.state;
    return (
      <AppBar position="static" className="header">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <img src={logo} className="logo" alt="logo" />
            <span className="header-title">Minerva Organization Lists</span>
          </Typography>
          <Button
            variant="contained"
            className="btn"
            onClick={this.props.signOut}
          >
            {btnText}
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
