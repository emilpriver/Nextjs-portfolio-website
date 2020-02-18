import React from "react";
import Link from "next/link";
import moment from "moment";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../sanity";
import Head from "../../components/head";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import Layout from "../../components/layout";

import "../../assets/scss/modules/articles.module.scss";

function imageURL(source) {
  return imageUrlBuilder(client).image(source);
}

const query = groq`*[_type == "post"] | order(_createdAt desc) {
  title,
  slug, 
  _createdAt,
  categories,
}`;

class Articles extends React.Component {
  static async getInitialProps() {
    const posts = await client.fetch(query);
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
                        <Link
                          href="/posts/[slug]"
                          as={`/posts/${el.slug.current}`}
                        >
                          <a>
                            <h3>{el.title}</h3>
                          </a>
                        </Link>
                        <span className="date">
                          {`${moment(el._createdAt)
                            .startOf("hour")
                            .fromNow()}`}
                        </span>
                        <div className="tags">
                          {el.categories.map((item, index) => {
                            return (
                              <span key={item.title}>
                                {`${item.title}
                                ${
                                  el.categories.length !== index + 1 ? ", " : ""
                                }`}
                              </span>
                            );
                          })}
                        </div>
                        <div className="read">
                          <Link
                            href="/posts/[slug]"
                            as={`/posts/${el.slug.current}`}
                          >
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
