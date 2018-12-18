import React, { Component } from "react";

class List extends Component {
  state = {
    id: "",
    list: [],
    items_complete: 0,
    gotList: false
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
        this.setState({ list: res.list, gotList: true }, () => {
          this.countCompleted();
        });
      });
  };

  updateItems = e => {
    let { list } = this.state;
    let temp = list[0];
    let items = list[0].items;
    let id = e.target.id;
    let checked = e.target.checked;
    if (!id) return;
    let selectedItem = items.find(item => item._id === id);
    let updatedItem = (selectedItem.completed = checked);
    temp.items.map(el => (el._id === selectedItem ? (el = updatedItem) : null));
    this.setState({ [list[0]]: temp });
  };

  countCompleted = () => {
    let { list } = this.state;
    let items = list[0].items;
    items.map(el => {
      if (el.completed) {
        return this.setState({ items_complete: this.state.items_complete + 1 });
      } else return null;
    });
  };

  progressPercentage = () => {
    let { items_complete, list } = this.state;
    let percent = (items_complete / list.length) * 100;
    return `${percent}%`;
  };

  render() {
    const { list, gotList } = this.state;
    const listContent = gotList ? (
      <div className="list">
        <h1>{list[0].listName}</h1>
        <div id="progress-bar">{this.progressPercentage()}</div>
        <div className="list-items">
          {list[0].items.map((clItem, clIdx) => (
            <React.Fragment key={clIdx}>
              <label
                htmlFor={clItem._id}
                className="label"
                onClick={this.updateItems}
              >
                {clItem.text}
                <input
                  type="checkbox"
                  id={clItem._id}
                  className="checkbox"
                  defaultChecked={clItem.completed}
                  onClick={this.updateItems}
                />
                <span className="checkmark" />
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>
    ) : (
      <div className="spinner" />
    );

    return (
      <article className="single-list-view">
        <section className="section-container wrap">{listContent} </section>
      </article>
    );
  }
}

export default List;
