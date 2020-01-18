import React from "react";
import NextHead from "next/head";
import { string } from "prop-types";

const Head = props => {
  const { title, description, url, ogImage } = props;
  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{title || ""}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
      <link rel="apple-touch-icon" href="/static/touch-icon.png" />
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
      <link rel="icon" href="/static/favicon.ico" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title || ""} />
      <meta property="og:description" content={description} />
      <meta name="twitter:site" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://use.typekit.net/sup0pbm.css"
      />
    </NextHead>
  );
};

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
};

Head.defaultProps = {
  title: "Emil Privér",
  description: "Emil Privér System developer in Borås",
  url: "https://priver.dev",
  ogImage:
    "https://media.sweamer.se/media/wallpaperflare.com_wallpaper_jWJGefq.jpg"
};

export default Head;
