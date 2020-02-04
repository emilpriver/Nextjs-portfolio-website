import React from "react";
import axios from "axios";

const sitemapXml = (data, articles) => {
  let latestPost = 0;
  let projectsXML = "";
  let articleXML = "";

  data.map(post => {
    const postDate = Date.parse(post.modified);
    if (!latestPost || postDate > latestPost) {
      latestPost = postDate;
    }

    const projectURL = `https://priver.dev/project/${post.acf.slug}/`;
    projectsXML += `
      <url>
        <loc>${projectURL}</loc>
        <lastmod>${postDate}</lastmod>
        <priority>0.50</priority>
      </url>`;
  });

  articles.map(post => {
    const postDate = Date.parse(post.published_at);

    const projectURL = `https://priver.dev/posts/${post.id}/`;
    articleXML += `
      <url>
        <loc>${projectURL}</loc>
        <lastmod>${postDate}</lastmod>
        <priority>0.50</priority>
      </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://priver.dev/</loc>
        <lastmod>${latestPost}</lastmod>
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
      ${articleXML}
    </urlset>`;
};

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const params = await axios
      .get(
        "https://api.privv.cloud/wp-json/wp/v2/works?filter=[orderby]=date",
        {
          headers: { "Cache-Control": "no-cache" }
        }
      )
      .then(response => response.data);

    const posts = await axios
      .get("https://dev.to/api/articles/me/", {
        headers: {
          "api-key": "FJ6KqkTCSS6FnafNYcEXdefw"
        }
      })
      .then(r => r.data)
      .catch(() => []);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemapXml(params, posts));
    res.end();
  }
}

export default Sitemap;
