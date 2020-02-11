import React from "react";
import axios from "axios";
import Link from "next/link";
import moment from "moment";

import Head from "../../components/head";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import Layout from "../../components/layout";

import "../../assets/scss/modules/articles.module.scss";

class Articles extends React.Component {
  static async getInitialProps() {
    const posts = await axios
      .get(
        "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40emilpriver"
      )
      .then(r => r.data)
      .then(r => r.items)
      .catch(() => false);

    return { posts };
  }

  render() {
    const { posts } = this.props;
    return (
      <Layout>
        <Head
          title="Emil Privér - Posts"
          description="Emil Privér - Posts written by Emil Privér"
        />
        <Nav />
        <section id="articles">
          <div className="container mx-auto">
            <h1>Posts</h1>
            {posts ? (
              <div className="row">
                {posts.map(el => {
                  return (
                    <div
                      className="article w-full md:w-1/2 lg:w-1/3 float-left"
                      key={el.title}
                    >
                      <div className="wrapper">
                        <a href={el.link} target="_blank">
                          <h3>{el.title}</h3>
                        </a>
                        <span className="date">
                          {`${moment(el.pubDate)
                            .startOf("hour")
                            .fromNow()}`}
                        </span>
                        <div className="tags">
                          {el.categories.map(tag => {
                            return (
                              <div key={tag} className="tag">
                                {tag}
                              </div>
                            );
                          })}
                        </div>
                        <div className="read">
                          <a href={el.link} target="_blank">
                            Read posts ->
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="row">
                <span>Error loading posts, please reload</span>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </Layout>
    );
  }
}

export default Articles;
