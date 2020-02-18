import React from "react";
import NextHead from "next/head";
import { string } from "prop-types";

const Head = props => {
  const { title, description, url, ogImage, seoTitle } = props;
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
      <meta property="og:title" content={seoTitle || title} />
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
        href="https://use.typekit.net/ymg4clq.css"
      />
      <link
        rel="preload"
        as="style"
        href="https://use.typekit.net/ymg4clq.css"
      />
    </NextHead>
  );
};

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  seoTitle: string,
  ogImage: string
};

Head.defaultProps = {
  title: "Emil Privér",
  seoTitle: null,
  description:
    "Emil Privér - Developer at Rivercode in Borås. I love programming",
  url: "https://priver.dev",
  ogImage: "https://cdn.privv.cloud/emilpriver/social_media_image.jpg"
};

export default Head;
