import React, { Component } from "react";

class PageTransition extends Component {
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  startTransition = () => {
    const element = document.querySelector(".router-transition");
    element.classList.remove("not-active");
    element.classList.add("active");
  };

  endTransition = () => {
    const element = document.querySelector(".router-transition");
    element.classList.add("not-active");
  };

  render() {
    const { children } = this.props;

    return (
      <>
        <div className="router-transition">
          <div className="first-block block" />
        </div>
        {children}
      </>
    );
  }
}

export default PageTransition;
