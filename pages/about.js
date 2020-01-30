import React from "react";
import axios from "axios";
import Head from "../components/head";
import Nav from "../components/nav";

class About extends React.Component {
  render() {
    return (
      <>
        <Head title="Emil Privér - About" />
        <Nav />
        <h1>About</h1>
      </>
    );
  }
}

export default About;
