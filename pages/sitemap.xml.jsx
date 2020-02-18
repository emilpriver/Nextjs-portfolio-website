import React from "react";
import moment from "moment";
import groq from "groq";
import client from "../sanity";

const queryProjects = groq`*[_type == "works"]{
  slug,
  publishedAt,
  _updatedAt
}`;

const queryPosts = groq`*[_type == "post"]{
  slug,
  _createdAt
}`;

const sitemapXml = (data, posts) => {
  let latestPost = 0;
  let projectsXML = "";
  let postsXML = "";

  data.map(post => {
    const postDate = Date.parse(post._updatedAt);
    if (!latestPost || postDate > latestPost) {
      latestPost = post._updatedAt;
    }

    const projectURL = `https://priver.dev/project/${post.slug.current}/`;
    projectsXML += `
      <url>
        <loc>${projectURL}</loc>
        <lastmod>${moment(post.publishedAt).format("YYYY-MM-DD")}</lastmod>
        <priority>0.50</priority>
      </url>`;
  });

  posts.map(post => {
    const URL = `https://priver.dev/posts/${post.slug.current}/`;
    postsXML += `
      <url>
        <loc>${URL}</loc>
        <lastmod>${moment(post._createdAt).format("YYYY-MM-DD")}</lastmod>
        <priority>0.50</priority>
      </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://priver.dev/</loc>
        <lastmod>${moment(latestPost).format("YYYY-MM-DD")}</lastmod>
        <priority>1.00</priority>
      </url>
      <url>
        <loc>https://priver.dev/about/</loc>
        <priority>0.80</priority>
      </url>
      <url>
        <loc>https://priver.dev/posts/</loc>
        <priority>0.80</priority>
      </url>
      ${projectsXML}
      ${postsXML}
    </urlset>`;
};

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const params = await client.fetch(queryProjects);
    const posts = await client.fetch(queryPosts);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemapXml(params, posts));
    res.end();
  }
}

export default Sitemap;
