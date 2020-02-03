import React from "react";
import axios from "axios";
import moment from "moment";

import Head from "../../components/head";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import Layout from "../../components/layout";

import "../../assets/scss/modules/single-article.module.scss";

class SingleArticle extends React.Component {
  static async getInitialProps(params) {
    const { slug } = params.query;
    const post = await axios
      .get(`https://dev.to/api/articles/${slug}`, {})
      .then(r => r.data);

    return { post };
  }

  render() {
    const { post } = this.props;
    return (
      <Layout>
        <Head
          title={`Emil Privér - Post: ${post.title}`}
          description={`Emil Privér - Post: ${post.description}`}
        />
        <Nav />
        <section id="single-article">
          <div className="container mx-auto">
            <div className="date">{moment(post.published_at).format("LL")}</div>
            <h1 className="title">{post.title}</h1>
            <div className="tags">{post.tag_list}</div>
            <div className="thumbnail">
              <img src={post.social_image} alt={post.title} />
            </div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: post.body_html }}
            />
          </div>
        </section>
        <Footer />
      </Layout>
    );
  }
}

export default SingleArticle;
