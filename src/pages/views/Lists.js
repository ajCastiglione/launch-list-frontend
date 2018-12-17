import React, { Component } from "react";
import { Link } from "react-router-dom";

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
    items_completed: 0
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
        this.setState({ lists: res.lists, receivedLists: true });
      })
      .catch(e => console.error(e));
  };

  render() {
    const { classes } = this.props;
    const { listType, receivedLists } = this.state;
    const lists = receivedLists
      ? this.state.lists.map(el => (
          <TableRow key={el._id}>
            <TableCell component="th" scope="row">
              {el.listName}
            </TableCell>
            <TableCell>{el.type}</TableCell>
            <TableCell>{el.items.length}</TableCell>
            <TableCell>{el.completed ? "Complete" : "Incomplete"}</TableCell>
            <TableCell>
              {el.createdAt
                ? `${new Date(el.createdAt).getMonth()}/${new Date(
                    el.createdAt
                  ).getDate() + 1}/${new Date(el.createdAt).getFullYear()}`
                : "No date found."}{" "}
            </TableCell>
            <TableCell>
              <Button variant="contained" color="primary">
                <Link to={`/list/${el._id}`} className="btn">
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
    );
  }
}

export default withStyles(styles)(Lists);
