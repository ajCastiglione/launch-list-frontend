import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import MySnackBar from "./../displayMessages/MySnackBar";
import validator from "validator";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  card: {
    maxWidth: "100%"
  },
  media: {
    height: 140,
    backgroundSize: "contain"
  },

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing.unit,
    fontWeight: "bold"
  },
  margin: {
    margin: "auto",
    marginTop: "1rem"
  }
});

class AddUser extends Component {
  state = {
    labelWidth: 0,
    email: "",
    password: "",
    role: "",
    userImg: "https://s3.amazonaws.com/minervalists/default_user_icon.png",
    warning: false,
    warningMsg: "",
    success: false,
    successMsg: "",
    failure: false,
    failureMsg: "",
    visible: false,
    loading: false
  };

  componentDidMount() {
    this.props
      .checkAuth()
      .then(role => (role === "admin" ? "" : <Redirect to="/" />));

    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  closeModal = () =>
    this.setState({ warning: false, success: false, failure: false });
  handleChange = e =>
    this.setState({ [e.target.name]: e.target.value, warning: false });
  toggleVis = () => this.setState({ visible: !this.state.visible });

  addUser = () => {
    let { email, password, role } = this.state;
    this.setState({ loading: true });
    if ((!email, !password, !role))
      return this.setState({
        warning: true,
        warningMsg: "All of the fields must be filled out.",
        loading: false
      });
    if (!validator.isEmail(email))
      return this.setState({
        warning: true,
        warningMsg: "Invalid email!",
        loading: false
      });
    fetch("//localhost:5000/users/add", {
      method: "POST",
      headers: {
        "x-auth": sessionStorage.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, role })
    })
      .then(res =>
        res.status === 200
          ? this.setState({
              loading: false,
              success: true,
              successMsg: "Successfully generated user!"
            })
          : this.setState({
              failure: true,
              failureMsg: "Unable to create new user"
            })
      )
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    const { email, password, role, userImg } = this.state;
    const userCard = (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={userImg}
            title="User Image"
          />
          <CardContent>
            <Divider />
            <Typography variant="h6" component="h3">
              Role: {role}
            </Typography>
            <Typography variant="h6" component="h3">
              Email: {email}
            </Typography>
            <Divider />
          </CardContent>
        </CardActionArea>
      </Card>
    );

    const editor = (
      <form className="profile-editor" action="">
        <h2>New User's Information</h2>
        <Divider />
        <FormControl className="text-fields">
          {this.state.warning ? (
            <MySnackBar
              variant={this.state.failure ? "error" : "warning"}
              className={classes.margin}
              message={
                this.state.failure
                  ? this.state.failureMsg
                  : this.state.warningMsg
              }
              onClick={this.closeModal}
            />
          ) : this.state.success ? (
            <MySnackBar
              variant="success"
              className={classes.margin}
              message={this.state.successMsg}
              onClick={this.closeModal}
            />
          ) : null}
          <TextField
            label="Email"
            name="email"
            className={classes.textField}
            value={email}
            onChange={this.handleChange}
            margin="normal"
            autoComplete="off"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="New Password"
            name="password"
            type={this.state.visible ? "text" : "password"}
            className={classes.textField}
            value={password}
            onChange={this.handleChange}
            margin="normal"
            autoComplete="off"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {this.state.visible ? (
                    <VisibilityOff
                      className="vis-icon"
                      onClick={this.toggleVis}
                    />
                  ) : (
                    <Visibility className="vis-icon" onClick={this.toggleVis} />
                  )}
                </InputAdornment>
              )
            }}
          />
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
        </FormControl>
        {this.state.loading ? (
          <div className="spinner" />
        ) : (
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={this.addUser}
          >
            Create User
          </Button>
        )}
      </form>
    );

    return (
      <article className="add-user-article">
        <h1 className="article-title">Create New User</h1>
        <section className="section-container add-user-section large-wrapper">
          <Grid container spacing={24} className="grid-container">
            <Grid item xs={12} sm={6} md={4} className="grid-item">
              {userCard}
            </Grid>
            <Grid item xs={12} sm={6} md={8} className="grid-item">
              {editor}
            </Grid>
          </Grid>
        </section>
      </article>
    );
  }
}
export default withStyles(styles)(AddUser);
