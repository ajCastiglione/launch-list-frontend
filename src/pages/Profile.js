import React, { Component } from "react";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import Email from "@material-ui/icons/Email";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  card: {
    maxWidth: "100%"
  },
  media: {
    height: 140,
    backgroundSize: "contain"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
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

class Profile extends Component {
  state = {
    role: "",
    un: "",
    email: "",
    password: "",
    userImg: "",
    title_bg: "",
    warning: false,
    warningMsg: "",
    success: false,
    successMsg: "",
    failure: false,
    failureMsg: "",
    visible: false
  };

  componentDidMount() {
    if (this.props.role) this.setState({ role: this.props.role });
    else this.fetchUserProfile();
  }

  fetchUserProfile = () => {
    fetch("//localhost:5000/users/me", {
      headers: { "x-auth": sessionStorage.token }
    })
      .then(res =>
        res.status === 200 ? res.json() : new Error("Invalid Token")
      )
      .then(res => {
        this.setState({
          role: res.user.role,
          un: res.user.username ? res.user.username : "",
          email: res.user.email,
          userImg: res.user.profile_img,
          title_bg: res.user.profile_pg_bg
        });
      })
      .catch(e => console.log(e));
  };

  closeModal = () =>
    this.setState({ warning: false, success: false, failure: false });
  handleChange = e =>
    this.setState({ [e.target.name]: e.target.value, warning: false });
  toggleVis = () => this.setState({ visible: !this.state.visible });

  submitProfile = () => {
    let { email, password, un, userImg, title_bg } = this.state;
    if (!email) {
      return this.setState({
        warning: true,
        warningMsg: "Email field cannot be blank!"
      });
    }
    if (!validator.isEmail(email)) {
      return this.setState({ warning: true, warningMsg: "Invalid email." });
    }
    fetch("//localhost:5000/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-auth": sessionStorage.token
      },
      body: JSON.stringify({
        email,
        username: un,
        profile_img: userImg,
        profile_pg_bg: title_bg,
        password
      })
    })
      .then(res => {
        if (res.status === 200) return res.json();
        return this.setState({
          failure: true,
          warning: true,
          failureMsg: "Unable to fulfill request."
        });
      })
      .then(res => {
        this.setState({
          un: res.username ? res.username : "",
          email: res.email,
          userImg: res.profile_img,
          title_bg: res.profile_pg_bg,
          failure: false,
          warning: false,
          success: true,
          password: "",
          successMsg: "Successfully Updated User Profile!"
        });
      })
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    let { role, un, email, userImg, title_bg } = this.state;
    const userCard = (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={userImg}
            title="User Image"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className="text-center"
            >
              {un ? un : "Create a username!"}
            </Typography>
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
        <h2>Update Profile Information</h2>
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
            label="Profile Picture"
            name="userImg"
            className={classes.textField}
            value={this.state.userImg}
            onChange={this.handleChange}
            margin="normal"
            autoComplete="off"
            variant="outlined"
            helperText="This only accepts urls to images"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddAPhoto />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Username"
            name="un"
            className={classes.textField}
            value={this.state.un}
            onChange={this.handleChange}
            margin="normal"
            autoComplete="off"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Email"
            name="email"
            className={classes.textField}
            value={this.state.email}
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
            value={this.state.password}
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
          <TextField
            label="Page Title Background"
            name="title_bg"
            className={classes.textField}
            value={this.state.title_bg}
            onChange={this.handleChange}
            margin="normal"
            autoComplete="off"
            variant="outlined"
            helperText="This only accepts urls to images"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddPhotoAlternate />
                </InputAdornment>
              )
            }}
          />
        </FormControl>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={this.submitProfile}
        >
          Save Changes
        </Button>
      </form>
    );
    return (
      <article className="profile-article">
        <h1
          className="article-title"
          style={title_bg ? { backgroundImage: `url(${title_bg})` } : null}
        >
          Profile
        </h1>
        <section
          className={`${
            classes.root
          } section-container profile-section large-wrapper`}
        >
          {role ? (
            <Grid container spacing={24} className="grid-container">
              <Grid item xs={12} sm={6} md={4} className="grid-item">
                {userCard}
              </Grid>
              <Grid item xs={12} sm={6} md={8} className="grid-item">
                {editor}
              </Grid>
            </Grid>
          ) : (
            <div className="spinner" />
          )}
        </section>
      </article>
    );
  }
}
export default withStyles(styles)(Profile);
