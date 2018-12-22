import React, { Component } from "react";
import { Link } from "react-router-dom";
import MySnackBar from "./../../displayMessages/MySnackBar";

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

class Users extends Component {
  state = {
    users: [],
    receivedUsers: false,
    searchResults: [],
    defaultLists: [],
    userToRemove: null,
    removedList: {},
    lastWarning: false,
    open: false
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    fetch(`//localhost:5000/users`, {
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
          users: res,
          receivedUsers: true,
          searchResults: res,
          defaultLists: res
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
    let { users } = this.state;
    let regex = new RegExp(value, "i");
    let temp = [];
    users.map(user => {
      if (user.email.match(regex) && value) {
        temp.push(user);
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

  askToDelete = email => this.setState({ userToRemove: email, open: true });

  deleteUser = () => {
    let { userToRemove } = this.state;
    let email = userToRemove;
    fetch(`//localhost:5000/users/remove/${email}`, {
      method: "delete",
      headers: {
        "x-auth": sessionStorage.token
      }
    })
      .then(res =>
        res.status === 200 ? res.json() : new Error("Could not remove list.")
      )
      .then(res => {
        this.setState({ open: false });
        this.fetchUsers();
      });
  };

  render() {
    const { classes } = this.props;
    const { searchResults, receivedUsers } = this.state;
    const users = receivedUsers
      ? searchResults.map(el => (
          <TableRow key={el._id}>
            <TableCell component="th" scope="row">
              {el.listName}
            </TableCell>
            <TableCell>{el._id}</TableCell>
            <TableCell>{el.email}</TableCell>
            <TableCell>{el.role}</TableCell>
            <TableCell>
              {el.username ? el.username : "No username created."}
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.askToDelete(el.email)}
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
          placeholder="Search by email..."
          type="search"
          onChange={this.handleSearch}
          autoComplete="off"
        />
        <Link to="/" className="return-btn">
          <i className="fas fa-caret-left" />
          Return to home
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
            Are you sure you want to remove this user?
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            This action{" "}
            <strong>
              <em>cannot</em>
            </strong>{" "}
            be undone, you must be absolutely positive you want to remove this
            user.
          </Typography>
          <div className="btn-container">
            <Button
              color="secondary"
              variant="contained"
              onClick={this.deleteUser}
            >
              Remove The User
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleClose}
            >
              Keep The User
            </Button>
          </div>
        </div>
      </Modal>
    );

    return (
      <div className="all-users-type">
        <h1 className="article-title">All Users - Admin Overview</h1>
        {searchBar}
        <article className="users-table">
          <section className="section-container">
            {modal}
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>All Users</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{users}</TableBody>
              </Table>
            </Paper>
          </section>
        </article>
      </div>
    );
  }
}

export default withStyles(styles)(Users);
