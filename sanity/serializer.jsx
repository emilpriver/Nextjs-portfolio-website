import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import LazyLoad from "react-lazyload";
import imageUrlBuilder from "@sanity/image-url";

import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import client from "./index";

function imageURL(source) {
  return imageUrlBuilder(client).image(source);
}

const serializers = {
  types: {
    code: props => (
      <SyntaxHighlighter language={props.node.language} style={darcula}>
        {props.node.code}
      </SyntaxHighlighter>
    ),
    image: props => (
      <figure>
        <LazyLoad offset={500}>
          <img
            src={imageURL(props.node.asset)
              .auto("format")
              .url()}
            alt={props.node.asset._ref}
          />
        </LazyLoad>
      </figure>
    )
  }
};

export default serializers;
