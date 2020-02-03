import React from "react";
import axios from "axios";

const sitemapXml = data => {
  let latestPost = 0;
  let projectsXML = "";

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
      ${projectsXML}
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

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemapXml(params));
    res.end();
  }
}

export default Sitemap;
