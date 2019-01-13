import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import url from "./../config/config";

// UI lib
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const styles = {
  card: {
    maxWidth: 345,
    margin: "auto",
    height: "100%"
  },
  media: {
    height: 140
  }
};

class Home extends Component {
  state = {
    all_lists: [],
    todo_list: [],
    launch_list: [],
    live_list: [],
    ecom_list: [],
    ecom_live_list: [],
    listsAcquired: false,
    listType: ""
  };

  componentDidMount() {
    this.props
      .checkForToken()
      .then(token => (token ? this.getLists() : <Redirect to="/login" />))
      .catch(e => <Redirect to="/login" />);
  }

  getLists = () => {
    fetch(`//${url}/lists`, {
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
        res.lists.map(el => {
          let temp = this.state[el.type];
          temp.push(el);
          return this.setState({ [el.type]: temp });
        });

        let allStateLists = [
          {
            title: "Todo Lists",
            array: this.state.todo_list,
            type: "todo_list",
            img: "https://s3.amazonaws.com/minervalists/todo-list.jpg"
          },
          {
            title: "Launch Lists",
            array: this.state.launch_list,
            type: "launch_list",
            img: "https://s3.amazonaws.com/minervalists/launch-list.png"
          },
          {
            title: "Live Lists",
            array: this.state.live_list,
            type: "live_list",
            img: "https://s3.amazonaws.com/minervalists/live-list.png"
          },
          {
            title: "Ecommerce Lists",
            array: this.state.ecom_list,
            type: "ecom_list",
            img: "https://s3.amazonaws.com/minervalists/ecom-list.png"
          },
          {
            title: "Ecommerce Live Lists",
            array: this.state.ecom_live_list,
            type: "ecom_live_list",
            img: "https://s3.amazonaws.com/minervalists/ecom-live-list.jpg"
          }
        ];
        this.setState({ listsAcquired: true, all_lists: allStateLists }, () =>
          window.scrollTo(0, 0)
        );
      })
      .catch(e => console.error(e));
  };

  countCompleted = array => {
    let totalCompleted = 0;
    array.map(el => {
      if (el.completed) return totalCompleted++;
      return false;
    });
    return totalCompleted;
  };

  handleMO = type => this.props.updateListType(type);

  render() {
    const { classes } = this.props;
    const { listsAcquired, all_lists } = this.state;
    const cards = listsAcquired ? (
      all_lists.map((lists, lIndex) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          key={`list-${lists.title}-${lIndex}`}
        >
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={lists.img}
                title="List"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {lists.title}
                </Typography>
                <Typography component="div">
                  <p>
                    {lists.title}: {lists.array.length}
                  </p>
                  <p>Completed: {this.countCompleted(lists.array)}</p>
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                className="btn-container"
                variant="outlined"
                size="small"
                color="primary"
              >
                <Link
                  to={`/lists/${lists.type}s`}
                  onMouseOver={() => this.handleMO(lists.type)}
                  className="btn"
                >
                  View All
                </Link>
              </Button>

              <Button
                className="btn-container"
                variant="outlined"
                size="small"
                color="primary"
              >
                <Link
                  to="/add-list"
                  className="btn"
                  onMouseOver={() => this.handleMO(lists.type)}
                >
                  Create More
                </Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))
    ) : (
      <div className="spinner" />
    );

    return (
      <article className="home-article">
        <h1 className="article-title">Home</h1>
        <section className="section-container large-wrapper">
          <h2>All Lists</h2>
          <Divider />
          <Grid container spacing={24} className="grid-container">
            {cards}
          </Grid>
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(Home);
