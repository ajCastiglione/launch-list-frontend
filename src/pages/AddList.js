import React, { Component } from "react";
import ReactDOM from "react-dom";
// UI Lib
import { withStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class AddList extends Component {
  state = {
    listType: "",
    labelWidth: 0
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <article className="add-list-article">
        <h1 className="add-list-title">Generate new list</h1>
        <section className="section-container add-list large-wrapper">
          <form className="add-list-form" action="">
            <Grid container spacing={24} className="form-grid">
              <Grid className="grid-left" item xs={12} md={6} lg={5}>
                <h2 className="add-list-subtitle">
                  Choose the type of list you would like to generate
                </h2>
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
                    <MenuItem value="todo">Todo List</MenuItem>
                    <MenuItem value="launch">Launch List</MenuItem>
                    <MenuItem value="live">Live List</MenuItem>
                    <MenuItem value="ecom">Ecommerce List</MenuItem>
                    <MenuItem value="ecom-live">Ecommerce Live List</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid className="grid-right" item xs={12} md={6} lg={5}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.submitNewList}
                >
                  Create List
                </Button>
              </Grid>
            </Grid>
          </form>
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(AddList);
