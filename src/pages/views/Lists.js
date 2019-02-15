import React, { Component } from "react";
import { Link } from "react-router-dom";
import MySnackBar from "./../../displayMessages/MySnackBar";
import { url } from "../../config/config";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  paper: {
    position: "absolute",
    width: "100%",
    "max-width": "450px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: "40%",
    left: 0,
    right: 0,
    margin: "auto"
  }
});

class Lists extends Component {
  state = {
    listType: this.props.listType
      ? this.props.listType
      : sessionStorage.listType,
    lists: [],
    receivedLists: false,
    searchResults: [],
    defaultLists: [],
    listToRemove: null,
    removedList: {},
    lastWarning: false,
    open: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchLists();
  }

  fetchLists = () => {
    let { listType } = this.state;
    fetch(`//${url}/lists/${listType}`, {
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res =>
        res.status === 200
          ? res.json()
          : new Error("Could not authenticate and acquire lists.")
      )
      .then(res => {
        this.setState({
          lists: res.lists,
          receivedLists: true,
          searchResults: res.lists,
          defaultLists: res.lists
        });
      })
      .catch(e => console.error(e));
  };

  handleClose = () => this.setState({ open: false });

  prettifyName = () => {
    let { listType } = this.state;
    let name = listType.split("_");
    if (listType === "ecom_live_list") {
      name = `${name[0]} ${name[1]} ${name[2]}`;
      return `${name}s`;
    }
    name = `${name[0]} ${name[1]}`;
    return `${name}s`;
  };

  handleSearch = e => {
    let { value } = e.target;
    let { lists } = this.state;
    let regex = new RegExp(value, "i");
    let temp = [];
    lists.map(list => {
      if (list.listName.match(regex) && value) {
        temp.push(list);
        return this.setState({ searchResults: temp, noMatch: false });
      } else if (temp.length === 0 && value) {
        return this.setState({
          searchResults: this.state.defaultLists,
          noMatch: true,
          msg: `No results for ${value}`
        });
      } else if (!value) {
        return this.setState({
          noMatch: false,
          searchResults: this.state.defaultLists
        });
      } else return false;
    });
  };

  askToDelete = id => this.setState({ listToRemove: id, open: true });

  deleteList = () => {
    let { listToRemove } = this.state;
    let id = listToRemove;
    fetch(`//${url}/lists/${id}`, {
      method: "delete",
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res =>
        res.status === 200 ? res.json() : new Error("Could not remove list.")
      )
      .then(res => {
        this.setState({
          removedList: res,
          open: false,
          lastWarning: true
        });
        this.fetchLists();
      });
  };

  dismissRestore = () => this.setState({ lastWarning: false });

  restoreList = () => {
    let { removedList, listType } = this.state;
    fetch(`//${url}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth": sessionStorage.token
      },
      body: JSON.stringify({
        type: listType,
        listName: removedList.listName,
        items: removedList.items
      })
    })
      .then(res =>
        res.status === 200
          ? res.json()
          : new Error("Could not re-add removed list.")
      )
      .then(res => {
        let { lists } = this.state;
        let temp = lists;
        temp.push(res);

        this.setState({
          lists: temp,
          searchResults: temp,
          defaultLists: temp,
          lastWarning: false
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { listType, receivedLists } = this.state;
    const lists = receivedLists
      ? this.state.searchResults.map(el => (
          <TableRow key={el._id}>
            <TableCell component="th" scope="row">
              {el.listName}
            </TableCell>
            <TableCell>{el.type}</TableCell>
            <TableCell>{el.items.length}</TableCell>
            <TableCell>{el.completed ? "Complete" : "Incomplete"}</TableCell>
            <TableCell>
              {el.createdAt
                ? `${new Date(el.createdAt).getMonth() + 1}/${new Date(
                    el.createdAt
                  ).getDate()}/${new Date(el.createdAt).getFullYear()}`
                : "No date found."}{" "}
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                className="link-container"
              >
                <Link to={`/list?id=${el._id}`} className="btn">
                  View
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.askToDelete(el._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))
      : null;
    const searchBar = (
      <div className="search-bar-container">
        <input
          id="search"
          placeholder="Search..."
          type="search"
          onChange={this.handleSearch}
          autoComplete="off"
        />
        <Link to="/" className="return-btn">
          <i className="fas fa-caret-left" />
          Return to all lists
        </Link>
        {this.state.noMatch ? (
          <div className="warning">
            <MySnackBar
              variant="warning"
              className={classes.margin}
              message={this.state.msg}
            />
          </div>
        ) : null}
      </div>
    );
    const modal = (
      <Modal
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        open={this.state.open}
        onClose={this.handleClose}
      >
        <div className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            Are you sure you want to remove this list?
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            This action can be undone, but it is illadvised to constantly remove
            and re-add lists.
          </Typography>
          <div className="btn-container">
            <Button
              color="secondary"
              variant="contained"
              onClick={this.deleteList}
            >
              Remove The List
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleClose}
            >
              Keep The List
            </Button>
          </div>
        </div>
      </Modal>
    );

    const askToRestore = (
      <React.Fragment>
        <Button variant="outlined" color="primary" onClick={this.restoreList}>
          restore list?
        </Button>
        <Button
          onClick={this.dismissRestore}
          variant="outlined"
          color="secondary"
        >
          No, I meant to delete it.
        </Button>
      </React.Fragment>
    );

    return (
      <div className="all-lists-type">
        <h1 className="article-title">All {this.prettifyName(listType)}</h1>
        {searchBar}
        <article className={`list-table ${listType}`}>
          <section className="section-container">
            {modal}
            {this.state.lastWarning ? askToRestore : null}
            {this.state.receivedLists ? (
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{listType}s (All Lists)</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date Created</TableCell>
                      <TableCell>View</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{lists}</TableBody>
                </Table>
              </Paper>
            ) : (
              <div className="spinner" />
            )}
          </section>
        </article>
      </div>
    );
  }
}

export default withStyles(styles)(Lists);
