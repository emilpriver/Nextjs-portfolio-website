import React from "react";
import moment from "moment";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
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

  render() {
    const { post } = this.props;

    if (!post) {
      return <Error />;
    }

    return (
      <Layout>
        <Head
          title={`Emil Privér - Post: ${post.title}`}
          description={`Emil Privér - Post: ${post.title}`}
          ogImage={imageURL(post.thumbnail.asset)
            .auto("format")
            .url()}
        />
        <Nav />
        <section id="single-article">
          <div className="container mx-auto">
            <div className="date">{moment(post.published_at).format("LL")}</div>
            <h1 className="title">{post.title}</h1>
            <div className="tags">{post.tag_list}</div>
            <div className="thumbnail">
              <img
                src={imageURL(post.thumbnail.asset)
                  .auto("format")
                  .url()}
                alt={post.title}
              />
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
