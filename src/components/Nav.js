import React, { Component } from "react";
import { Link } from "react-router-dom";
import { url } from "./../config/config";

// UI Lib
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";

// Icons
import ViewList from "@material-ui/icons/ViewList";
import Menu from "@material-ui/icons/Menu";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  hr: {
    height: 5,
    marginTop: 10,
    marginBottom: 10
  }
});

class Nav extends Component {
  state = {
    left: false,
    open: false,
    role: ""
  };

  componentDidMount() {
    this.fetchUserRole();
  }

  fetchUserRole = () => {
    fetch(`//${url}/users/me`, {
      headers: { "x-auth": sessionStorage.token }
    })
      .then(res =>
        res.status === 200 ? res.json() : new Error("Invalid Token")
      )
      .then(res => {
        if (res.user) this.setState({ role: res.user.role });
      })
      .catch(e => console.log(e));
  };

  toggleDrawer = (side, open) => {
    this.setState({
      [side]: open
    });
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  navClicked = (side, open) => () => {
    this.toggleDrawer(side, open);
  };

  navItemClicked = (side, open) => () => {
    this.toggleDrawer(side, open);
    this.handleClick();
  };

  topItemClicked = (side, open) => () => {
    this.toggleDrawer(side, open);
  };

  render() {
    const { classes } = this.props;
    const sideList = (
      <div className={classes.list}>
        <List
          component="nav"
          subheader={<ListSubheader component="div">All Routes</ListSubheader>}
          className={`${classes.root} nav-root`}
        >
          <ListItem button className="nav-item">
            <Link to="/" onClick={this.topItemClicked("left", false)}>
              Home
            </Link>
          </ListItem>
          <ListItem button className="nav-item">
            <Link to="/profile" onClick={this.topItemClicked("left", false)}>
              Profile
            </Link>
          </ListItem>
          <ListItem button className="nav-item">
            <Link to="/uptime" onClick={this.topItemClicked("left", false)}>
              Uptime Monitors
            </Link>
          </ListItem>
          <ListItem button className="nav-item">
            <Link to="/add-list" onClick={this.topItemClicked("left", false)}>
              Add List
            </Link>
          </ListItem>

          <Divider />
          {this.state.role === "admin" ? (
            <React.Fragment>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <ViewList />
                </ListItemIcon>
                <ListItemText primary="Admin Actions" />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={`${classes.nested} nav-item`}>
                    <Link
                      to="/users"
                      onClick={this.navItemClicked("left", false)}
                    >
                      All Users
                    </Link>
                  </ListItem>
                  <ListItem button className={`${classes.nested} nav-item`}>
                    <Link
                      to="/users/add"
                      onClick={this.navItemClicked("left", false)}
                    >
                      Add User
                    </Link>
                  </ListItem>
                  <ListItem button className={`${classes.nested} nav-item`}>
                    <Link
                      to="/users/lists"
                      onClick={this.navItemClicked("left", false)}
                    >
                      View All Lists
                    </Link>
                  </ListItem>
                </List>
              </Collapse>
            </React.Fragment>
          ) : null}
          <ListItem className="nav-item">
            <Button
              variant="contained"
              color="secondary"
              onClick={this.props.signOut}
              className="signout-btn"
            >
              logout
            </Button>
          </ListItem>
        </List>
      </div>
    );

    return (
      <div>
        <Button onClick={this.navClicked("left", true)}>
          <div className="nav-title-container">
            <Menu /> <h3 className="nav-title">Menu</h3>
          </div>
        </Button>
        <Drawer
          className="popout-nav"
          open={this.state.left}
          onClose={this.navClicked("left", false)}
        >
          <div tabIndex={0} role="button">
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}
export default withStyles(styles)(Nav);
