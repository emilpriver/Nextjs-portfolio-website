import React from "react";
import dayjs from "dayjs";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import LazyLoad from "react-lazyload";
import client from "../../sanity";
import serializer from "../../sanity/serializer";
import Head from "../../components/head";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import Layout from "../../components/layout";
import Error from "../_error";

import "../../assets/scss/modules/single-article.module.scss";

function imageURL(source) {
  return imageUrlBuilder(client).image(source);
}

const query = groq`*[_type == "post" && slug.current == $slug][0]`;

class SingleArticle extends React.Component {
  static async getInitialProps(context) {
    const { slug } = context.query;
    const post = await client.fetch(query, { slug });
    return { post };
  }

  componentDidMount = () => this.props.endTransition();

  componentWillUnmount = () => this.props.startTransition();

  render() {
    const { post } = this.props;

    if (!post) {
      return <Error />;
    }

    const seotitle = post.seo.seo_title
      ? post.seo.seo_title
      : `Post: ${post.title}`;

    return (
      <Layout>
        <Head
          title={`Emil Privér - Post: ${post.title}`}
          seoTitle={`Emil Privér - ${seotitle}`}
          description={`${post.seo.meta_description}`}
          ogImage={imageURL(post.thumbnail.asset)
            .auto("format")
            .url()}
        />
        <Nav />
        <section id="single-article">
          <div className="container mx-auto">
            <div className="date">
              {dayjs(post.publishedAt).format("MMMM D, YYYY")}
            </div>
            <h1 className="title">{post.title}</h1>
            <div className="tags">
              {post.categories.map((el, index) => {
                return (
                  <span key={el.title}>
                    {`${el.title}
                    ${post.categories.length !== index + 1 ? ", " : ""}`}
                  </span>
                );
              })}
            </div>
            <div className="thumbnail">
              <LazyLoad offset={200}>
                <img
                  src={imageURL(post.thumbnail.asset)
                    .auto("format")
                    .url()}
                  alt={post.title}
                />
              </LazyLoad>
            </div>
            <div className="content">
              <BlockContent
                serializers={serializer}
                blocks={post.body}
                {...client.config()}
              />
            </div>
          </div>
        </section>
        <Footer />
      </Layout>
    );
  }
}

export default SingleArticle;
