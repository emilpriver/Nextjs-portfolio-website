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
      .get("https://dev.to/api/articles/me/", {
        headers: {
          "api-key": "FJ6KqkTCSS6FnafNYcEXdefw"
        }
      })
      .then(r => r.data)
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
                      key={el.id}
                    >
                      <div className="wrapper">
                        <Link href="/posts/[slug]" as={`/posts/${el.id}`}>
                          <a>
                            <h3>{el.title}</h3>
                          </a>
                        </Link>
                        <span className="date">
                          {`${moment(el.published_at)
                            .startOf("hour")
                            .fromNow()}`}
                        </span>
                        <div className="tags">
                          {el.tag_list.map(tag => {
                            return (
                              <div key={tag} className="tag">
                                {tag}
                              </div>
                            );
                          })}
                        </div>
                        <div className="read">
                          <Link href="/posts/[slug]" as={`/posts/${el.id}`}>
                            <a>Read posts -></a>
                          </Link>
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
