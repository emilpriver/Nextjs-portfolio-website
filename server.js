const express = require("express");
const next = require("next");
const axios = require("axios");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

let sitemap;

app.prepare().then(() => {
  const server = express();

  server.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    // if we have a cached entry send it
    if (sitemap) {
      res.send(sitemap);
      return;
    }
    try {
      const smStream = new SitemapStream({ hostname: "https://priver.dev" });
      const pipeline = smStream.pipe(createGzip());

      smStream.write({ url: "/", changefreq: "yearly", priority: 1 });
      smStream.write({ url: "/about/", changefreq: "yearly", priority: 0.8 });

      await axios
        .get(
          "https://api.privv.cloud/wp-json/wp/v2/works?filter=[orderby]=date",
          {
            headers: { "Cache-Control": "no-cache" }
          }
        )
        .then(response => response.data)
        .then(r => {
          r.map(post => {
            smStream.write({
              url: `https://priver.dev/project/${post.acf.slug}/`,
              changefreq: "monthly",
              priority: 0.5
            });
          });
        });
      smStream.end();

      // cache the response
      streamToPromise(pipeline).then(sm => (sitemap = sm));
      // stream the response
      pipeline.pipe(res).on("error", e => {
        throw e;
      });
    } catch (e) {
      res.status(500).end();
    }
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
