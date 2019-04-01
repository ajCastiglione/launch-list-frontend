import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import _ from "lodash";
// UI lib
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Button from "@material-ui/core/Button";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: "auto"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class PaginatedTable extends React.Component {
  state = {
    rows: this.props.monitors,
    page: 0,
    rowsPerPage: 5
  };

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps.monitors, this.props.monitors)) return;
    this.setState({ rows: nextProps.monitors });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  formatDate = date => {
    return date
      ? `${new Date(date).toLocaleTimeString()} ${new Date(
          date
        ).toLocaleDateString()}`
      : "Never Been Monitored";
  };

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {this.props.header.map(row => (
                  <TableCell key={`${row}_name`}>{row}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => (
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.url}
                    </TableCell>
                    <TableCell align="right">
                      {row.siteStatus ? row.siteStatus : "No Data"}
                    </TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="right">
                      {this.formatDate(row.timeLastChecked)}
                    </TableCell>
                    <TableCell align="right">{`${row.settings.interval} ${
                      row.settings.intervalType
                    }`}</TableCell>
                    <TableCell align="right">{row.adminEmail}</TableCell>
                    <TableCell align="right">
                      {row.websiteName ? row.websiteName : row.url}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        className="btn-container"
                        onClick={() => this.props.startMonitor(row.url)}
                      >
                        Start
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        className="btn-container edit-monitor"
                      >
                        <Link to={`/monitor?id=${row._id}`} className="btn">
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="secondary"
                        className="btn"
                        onClick={() => this.props.askToDelete(row.url)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  colSpan={1}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  style={{ float: "left" }}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

PaginatedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PaginatedTable);
