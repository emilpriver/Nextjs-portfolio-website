import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import groq from "groq";
import client from "../../sanity";
import Head from "../../components/head";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import Layout from "../../components/layout";

import "../../assets/scss/modules/articles.module.scss";

dayjs.extend(require("dayjs/plugin/relativeTime"));

const query = groq`*[_type == "post"] | order(publishedAt desc) {
  title,
  slug, 
  publishedAt,
  categories,
}`;

export async function getStaticProps() {
  const data = await client.fetch(query);
  return { props: { posts: data } };
}

const Posts = props => {
  const { posts } = props;
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
                        {dayjs(el.publishedAt).from()}
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
};

export default Posts;
