import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";

const Home = () => (
  <>
    <Head title="Emil Privér - System Egineer in Borås" />
    <Nav />
    <section id="hero">
      <div className="wrapper">
        <h1>Emil Privér</h1>
      </div>
    </section>
  </>
);

export default Home;
