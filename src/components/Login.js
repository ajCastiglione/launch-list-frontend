import React, { Component } from "react";
import logo from "./../logo.png";
// UI Lib
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

class Login extends Component {
  render() {
    const { classes } = this.props;
    return (
      <main className="main login-landing">
        <form className="form">
          <img className="logo" src={logo} alt="logo" />
          <h3 className="form-title">Log in</h3>
          <TextField
            className={`${classes.margin} input-txt-container`}
            id="email"
            label="Email"
            placeholder="Email"
            name="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-user icon" />
                </InputAdornment>
              )
            }}
            autoFocus={true}
            required={true}
          />
          <TextField
            className={`${classes.margin} input-txt-container`}
            id="password"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-lock icon" />
                </InputAdornment>
              )
            }}
            required={true}
          />
          <Button
            variant="contained"
            color="primary"
            className={`${classes.button} btn`}
          >
            Sign In
          </Button>
        </form>
      </main>
    );
  }
}

export default withStyles(styles)(Login);
