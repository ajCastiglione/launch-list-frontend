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

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
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
    defaultLists: []
  };

  componentDidMount() {
    this.fetchLists();
  }

  fetchLists = () => {
    let { listType } = this.state;
    fetch(`//localhost:5000/lists/${listType}`, {
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

  handleSearch = e => {
    let { value } = e.target;
    let { lists } = this.state;
    let temp = [];

    lists.map(list => {
      if (list.listName.includes(value) && value) {
        temp.push(list);
        return this.setState({ searchResults: temp, noMatch: false });
      } else if (temp.length === 0 && value) {
        return this.setState({
          searchResults: this.state.defaultLists,
          noMatch: true,
          msg: `No results for ${value}`
        });
      } else {
        return this.setState({ noMatch: false });
      }
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
              <Button variant="contained" color="primary">
                <Link to={`/list?id=${el._id}`} className="btn">
                  View
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              {/* this will be updated to contain a function that removes the list. */}
              <Button variant="contained" color="secondary">
                <Link to={`/list/${el._id}`} className="btn">
                  Delete
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))
      : null;
    return (
      <React.Fragment>
        <div className="search-bar-container">
          <input
            id="search"
            placeholder="Search..."
            type="search"
            onChange={this.handleSearch}
            autoComplete="off"
          />
          <Link to="/all-lists" className="btn">
            <i className="fas fa-caret-left" />
            Return to all lists
          </Link>
          {this.state.noMatch ? (
            <div className="warning">
              <MySnackBar
                variant="warning"
                className={classes.margin}
                message={this.state.msg}
                onClick={this.closeModal}
              />
            </div>
          ) : null}
        </div>

        <article className={`list-table ${listType}`}>
          <section className="section-container">
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
          </section>
        </article>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Lists);
