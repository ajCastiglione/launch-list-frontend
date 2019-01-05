import React, { Component } from "react";
import ReactDOM from "react-dom";
import url from "./../config/config";

// Display messages
import MySnackBar from "./../displayMessages/MySnackBar";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: "10px auto",
    "text-transform": "capitalize"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  card: {
    maxWidth: "100%"
  },
  media: {
    height: 140
  }
});

class AddList extends Component {
  state = {
    listType: "",
    listName: "",
    labelWidth: 0,
    listID: null,
    success: false,
    msg: "",
    warning: false,
    failure: false,
    listTypes: [
      {
        name: "todo_list",
        img: "https://s3.amazonaws.com/minervalists/todo-list.jpg"
      },
      {
        name: "live_list",
        img: "https://s3.amazonaws.com/minervalists/live-list.png"
      },
      {
        name: "launch_list",
        img: "https://s3.amazonaws.com/minervalists/launch-list.png"
      },
      {
        name: "ecom_list",
        img: "https://s3.amazonaws.com/minervalists/ecom-list.png"
      },
      {
        name: "ecom_live_list",
        img: "https://s3.amazonaws.com/minervalists/ecom-live-list.jpg"
      }
    ]
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
    if (sessionStorage.listType)
      this.setState({ listType: sessionStorage.listType });
  }

  closeModal = () =>
    this.setState({ warning: false, success: false, failure: false });

  getImage = () => {
    let { listTypes, listType } = this.state;
    let img;
    listTypes.map(type => {
      if (type.name === listType) img = type.img;
      return false;
    });
    return img
      ? img
      : "https://s3.amazonaws.com/minervalists/list-placeholder.jpg";
  };

  prettifyName = () => {
    let name = this.state.listType;
    name = name.split("_");
    if (this.state.listType === "ecom_live_list")
      return (name = `${name[0]} ${name[1]} ${name[2]}`);

    name = `${name[0]} ${name[1]}`;
    return name;
  };

  handleChange = e => {
    this.setState(
      {
        [e.target.name]: e.target.value,
        warning: false,
        success: false,
        failure: false
      },
      () => {
        sessionStorage.listType = this.state.listType;
        this.props.updateListType(this.state.listType);
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    let { listType, listName } = this.state;
    if (!listType || !listName)
      return this.setState({
        warning: true,
        msg: "Name of website and list type are required."
      });
    fetch(`//${url}/lists`, {
      method: "POST",
      headers: {
        "x-auth": sessionStorage.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type: listType, listName })
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          this.setState({
            warning: true,
            failure: true,
            msg: "List name must be unique."
          });
          throw Error("Duplicate key");
        }
      })
      .then(res => {
        this.setState({
          success: true,
          msg: "List created successfully!",
          listID: res._id,
          listName: "",
          listType: ""
        });
      })
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    const { listType, listName } = this.state;
    const listCard = (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={this.getImage()}
            title="User Image"
          />
          <CardContent>
            <Divider />
            <Typography variant="h6" component="h3" className="capitalize">
              Type: {listType ? this.prettifyName() : null}
            </Typography>
            <Typography variant="h6" component="h3" className="capitalize">
              List Name: {listName}
            </Typography>
            <Divider />
          </CardContent>
        </CardActionArea>
      </Card>
    );

    const form = (
      <React.Fragment>
        <h2 className="add-list-title">Create a list:</h2>
        <Divider />

        <form className="add-list-form" action="">
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-label"
            >
              List Type
            </InputLabel>
            <Select
              value={this.state.listType}
              onChange={this.handleChange}
              input={
                <OutlinedInput
                  labelWidth={this.state.labelWidth}
                  name="listType"
                  id="outlined-label"
                />
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="todo_list">Todo List</MenuItem>
              <MenuItem value="launch_list">Launch List</MenuItem>
              <MenuItem value="live_list">Live List</MenuItem>
              <MenuItem value="ecom_list">Ecommerce List</MenuItem>
              <MenuItem value="ecom_live_list">Ecommerce Live List</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="List Name"
            name="listName"
            className={`${classes.textField} input-txt-container`}
            value={this.state.listName}
            onChange={this.handleChange}
            placeholder="List Name"
            margin="normal"
            variant="outlined"
          />
        </form>
        <Button
          className="create-btn"
          variant="outlined"
          color="primary"
          onClick={this.handleSubmit}
        >
          Create List
        </Button>
      </React.Fragment>
    );
    return (
      <article className="add-list-article">
        <h1 className="article-title">Generate new list</h1>
        <section className="section-container add-list large-wrapper">
          {this.state.warning ? (
            <MySnackBar
              variant={this.state.failure ? "error" : "warning"}
              className={classes.margin}
              message={this.state.msg}
              onClick={this.closeModal}
            />
          ) : this.state.success ? (
            <MySnackBar
              variant="success"
              className={`${classes.margin} success-msg`}
              message={this.state.msg}
              target={this.state.listID}
              onClick={this.closeModal}
            />
          ) : null}
          <Grid container spacing={24} className="form-grid">
            <Grid className="grid-left" item xs={12} sm={6} md={4}>
              {listCard}
            </Grid>
            <Grid className="grid-right" item xs={12} sm={6} md={8}>
              {form}
            </Grid>
          </Grid>
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(AddList);
