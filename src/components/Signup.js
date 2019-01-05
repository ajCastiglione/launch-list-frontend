import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import logo from "./../logo.png";
import url from "./../config/config";
import CryptoJS from "crypto-js";

// UI Lib
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import MySnackBar from "./../displayMessages/MySnackBar";
import amber from "@material-ui/core/colors/amber";
import { withStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  warning: {
    backgroundColor: amber[700]
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width: "90%",
    maxWidth: "400px",
    color: "#fff"
  },
  underline: {
    "&:after": {
      borderBottomColor: "#2ebf91"
    }
  }
});

class Signup extends Component {
  state = {
    labelWidth: 0,
    email: "",
    password: "",
    createCommand: "",
    role: "",
    loading: false,
    visible: false,
    warning: false,
    success: false,
    failure: false,
    msg: ""
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  handleChange = e => {
    if (e.which === 13) return this.submitLogin();
    this.setState({
      [e.target.name]: e.target.value,
      warning: false,
      failure: false,
      success: false
    });
  };

  closeModal = () => this.setState({ warning: false });
  toggleVis = () => this.setState({ visible: !this.state.visible });

  submitLogin = () => {
    let { email, password, role, createCommand } = this.state;
    if (!email || !password || !createCommand || !role)
      return this.setState({
        warning: true,
        warningMsg: "All fields are required to create a new user."
      });

    this.setState({ loading: true });
    this.registerUser(email, password, role, createCommand);
  };

  registerUser = (email, password, role, createCommand) => {
    let secret = `${process.env.REACT_APP_CRYPTO_SECRET}`;
    let command = CryptoJS.AES.encrypt(createCommand, secret).toString();
    fetch(`//${url}/users/add`, {
      method: "POST",
      headers: {
        createCommand: command,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, role })
    })
      .then(res =>
        res.status === 200
          ? this.setState({
              success: true,
              msg: "Added user successfully!",
              email: "",
              password: "",
              role: "",
              createCommand: "",
              loading: false
            })
          : res.json().then(error =>
              this.setState({
                failure: true,
                loading: false,
                msg: error.err
              })
            )
      )
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    return (
      <article className="signup">
        <form className="form">
          <img className="logo" src={logo} alt="logo" />
          <h3 className="form-title">Log in</h3>
          {this.state.warning || this.state.failure ? (
            <MySnackBar
              variant={this.state.failure ? "error" : "warning"}
              className={classes.margin}
              message={this.state.msg}
              onClick={this.closeModal}
            />
          ) : this.state.success ? (
            <MySnackBar
              variant="success"
              className={classes.margin}
              message={this.state.msg}
              onClick={this.closeModal}
            />
          ) : null}
          <FormControl className={classes.formControl}>
            <TextField
              className={`${classes.margin} input-txt`}
              id="email"
              label="Email"
              placeholder="Email"
              type="email"
              name="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fas fa-user icon" />
                  </InputAdornment>
                ),
                className: classes.label
              }}
              autoFocus={true}
              required={true}
              autoComplete="off"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              className={`${classes.margin} input-txt`}
              id="password"
              label="Password"
              placeholder="Password"
              name="password"
              type={this.state.visible ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {this.state.visible ? (
                      <VisibilityOff
                        className="vis-icon icon"
                        onClick={this.toggleVis}
                      />
                    ) : (
                      <Visibility
                        className="vis-icon icon"
                        onClick={this.toggleVis}
                      />
                    )}
                  </InputAdornment>
                )
              }}
              required={true}
              onChange={this.handleChange}
              onKeyPress={this.handleChange}
              value={this.state.password}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-label"
            >
              Role
            </InputLabel>
            <Select
              className="input-select"
              value={this.state.role}
              onChange={this.handleChange}
              input={
                <OutlinedInput
                  labelWidth={this.state.labelWidth}
                  name="role"
                  id="outlined-label"
                />
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              className={`${classes.margin} input-txt`}
              label="User Creation Password"
              id="create-command"
              placeholder="User Creation Password"
              name="createCommand"
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fas fa-lock icon" />
                  </InputAdornment>
                )
              }}
              required={true}
              onChange={this.handleChange}
              onKeyPress={this.handleChange}
              value={this.state.createCommand}
            />
          </FormControl>
          {this.state.loading ? (
            <div className="spinner" />
          ) : (
            <FormControl className="btns-container">
              <Button
                variant="contained"
                color="primary"
                className={`${classes.button} btn-primary`}
                onClick={this.submitLogin}
              >
                Register User
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={`${classes.button} btn`}
              >
                <Link to="/login" className="signup-btn">
                  Log in
                </Link>
              </Button>
            </FormControl>
          )}
        </form>
      </article>
    );
  }
}

export default withStyles(styles)(Signup);
