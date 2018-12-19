import React, { Component } from "react";
import ReactDOM from "react-dom";
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
  }
});

class AddList extends Component {
  state = {
    listType: "",
    listName: "",
    website: "",
    labelWidth: 0,
    listID: null,
    success: false,
    successMsg: "",
    warning: false,
    warningMsg: "",
    failure: false
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  closeModal = () =>
    this.setState({ warning: false, success: false, failure: false });

  handleChange = e => {
    this.setState(
      {
        [e.target.name]: e.target.value,
        warning: false,
        success: false,
        failure: false
      },
      () => (sessionStorage.listType = this.state.listType)
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    let { listType, listName } = this.state;
    if (!listType || !listName)
      return this.setState({
        warning: true,
        warningMsg: "Name of website and list type are required."
      });
    fetch("//localhost:5000/lists", {
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
            warningMsg: "List name must be unique."
          });
          throw Error("Duplicate key");
        }
      })
      .then(res => {
        this.setState({
          success: true,
          successMsg: "List created successfully!",
          listID: res._id,
          listName: "",
          listType: ""
        });
      })
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <article className="add-list-article">
          <h1 className="article-title">Generate new list</h1>
          <section className="section-container add-list large-wrapper">
            <form className="add-list-form" action="">
              {this.state.warning ? (
                <MySnackBar
                  variant={this.state.failure ? "error" : "warning"}
                  className={classes.margin}
                  message={this.state.warningMsg}
                  onClick={this.closeModal}
                />
              ) : this.state.success ? (
                <MySnackBar
                  variant="success"
                  className={`${classes.margin} success-msg`}
                  message={this.state.successMsg}
                  target={this.state.listID}
                  onClick={this.closeModal}
                />
              ) : null}
              <Grid container spacing={24} className="form-grid">
                <Grid className="grid-left" item xs={12} md={6} lg={5}>
                  <h2 className="add-list-subtitle">
                    select the type of list:
                  </h2>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
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
                      <MenuItem value="ecom_live_list">
                        Ecommerce Live List
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <React.Fragment>
                    <h2 className="add-list-subtitle">
                      {this.state.listType === "todo_list"
                        ? "List Name: "
                        : "Website Name: "}
                      {this.state.listName}
                    </h2>
                    <TextField
                      label="List Name"
                      name="listName"
                      className={`${classes.textField} input-txt-container`}
                      value={this.state.listName}
                      onChange={this.handleChange}
                      placeholder="List Name"
                      margin="normal"
                    />
                  </React.Fragment>
                </Grid>
                <Grid className="grid-right" item xs={12} md={6} lg={5}>
                  <h2 className="add-list-subtitle">submit new list</h2>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleSubmit}
                  >
                    Create List
                  </Button>
                </Grid>
              </Grid>
            </form>
          </section>
        </article>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AddList);
