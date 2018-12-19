import React, { Component } from "react";
import MySnackBar from "./../../displayMessages/MySnackBar";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  }
});

class List extends Component {
  state = {
    id: "",
    list: {},
    items_complete: 0,
    gotList: false,
    progress: "0%",
    newText: "",
    showEditor: false,
    listCompleteMsg: "This list is complete!"
  };

  componentDidMount() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    this.setState({ id }, () => this.fetchList());
  }

  fetchList = () => {
    fetch(`//localhost:5000/list/${this.state.id}`, {
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res =>
        res.status === 200
          ? res.json()
          : new Error("Could not authenticate user.")
      )
      .then(res => {
        this.setState({ list: res.list[0], gotList: true }, () => {
          this.countCompleted();
        });
      });
  };

  updateItems = e => {
    let { list } = this.state;
    let temp = list;
    let items = list.items;
    let id = e.target.id;
    let checked = e.target.checked;
    if (!id) return;
    let selectedItem = items.find(item => item._id === id);
    let updatedItem = (selectedItem.completed = checked);
    temp.items.map(el => (el._id === selectedItem ? (el = updatedItem) : null));
    this.setState({ list: temp, items_complete: 0 }, () => this.sendNewList());
  };

  countCompleted = () => {
    let { list } = this.state;
    let items = list.items;
    let total = 0;
    items.map(el => {
      if (el.completed) return total++;
      else return false;
    });
    this.setState({ items_complete: total }, () => this.progressPercentage());
  };

  progressPercentage = () => {
    let { items_complete, list } = this.state;
    if (list.items.length === 0) return this.setState({ progress: "0%" });
    let percent = (items_complete / list.items.length) * 100;
    percent = Math.round(percent);

    return this.setState({ progress: `${percent}%` });
  };

  // Updating newly added items
  toggleEditor = () => this.setState({ showEditor: !this.state.showEditor });

  removeItem = id => {
    let { list } = this.state;
    let items = list.items;
    let newItems = items.filter(item => item._id !== id);
    let temp = list;
    temp.items = newItems;
    this.setState({ list: temp }, () => this.sendNewList());
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setNewItem = () => {
    let { list } = this.state;
    let item = this.state.newText;
    let itemObj = { text: item, completed: false };
    let temp = list;
    temp.items.push(itemObj);
    this.setState({ list: temp }, () => this.sendNewList());
  };

  sendNewList = () => {
    let { list } = this.state;
    let newItems = list.items;
    fetch(`//localhost:5000/list/${this.state.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth": sessionStorage.token
      },
      body: JSON.stringify({ items: newItems })
    })
      .then(res =>
        res.status === 200
          ? res.json()
          : new Error("Could not add new list item.")
      )
      .then(res => {
        console.log(res);
        this.setState({ list: res }, () => this.countCompleted());
      })
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    const { list, gotList } = this.state;
    const listContent = gotList ? (
      <div className="list">
        {this.state.list.completed ? (
          <MySnackBar
            variant="success"
            className="success-alert"
            message={this.state.listCompleteMsg}
          />
        ) : null}
        <div id="progress-bar">
          <h1 className="single-list-title">{list.listName}</h1>
          <h3>{this.state.progress}</h3>
        </div>
        <div className="list-items">
          {list.items.map((clItem, clIdx) => (
            <React.Fragment key={clIdx}>
              <label
                htmlFor={clItem._id}
                className={`label ${
                  clItem.completed ? "cl-selected" : "cl-deselected"
                }`}
                onClick={this.updateItems}
              >
                {clItem.text}
                <input
                  type="checkbox"
                  id={clItem._id}
                  className="checkbox"
                  defaultChecked={clItem.completed}
                />
                <span className="checkmark" />
                <IconButton
                  aria-label="Delete"
                  className="delete-item"
                  onClick={() => this.removeItem(clItem._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </label>
            </React.Fragment>
          ))}
        </div>
        <Fab
          color="primary"
          aria-label="Add"
          className={`${classes.fab} add-btn`}
          size="small"
          onClick={this.toggleEditor}
        >
          <AddIcon />
        </Fab>
      </div>
    ) : (
      <div className="spinner" />
    );

    const addToList = (
      <React.Fragment>
        <h1 className="add-item-title">New Task: {this.state.newText}</h1>
        <div className="new-item-input-container">
          <TextField
            id="new-item-text"
            label="New List Item"
            value={this.state.newText}
            onChange={this.handleChange}
            className={`${classes.textField} input-txt`}
            margin="normal"
            name="newText"
            autoComplete="off"
          />
          <Button
            variant="outlined"
            color="primary"
            className={`${classes.button} input-btn`}
            onClick={this.setNewItem}
          >
            Primary
          </Button>
        </div>
      </React.Fragment>
    );

    return (
      <article className="single-list-view">
        <section className="section-container wrap">
          {listContent}
          {this.state.showEditor ? addToList : null}
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(List);
