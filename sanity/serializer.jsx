import React from "react";
import Highlight from "react-highlight";
import LazyLoad from "react-lazyload";
import imageUrlBuilder from "@sanity/image-url";
import client from "./index";

function imageURL(source) {
  return imageUrlBuilder(client).image(source);
}

const serializers = {
  types: {
    code: props => (
      <Highlight className={props.node.language}>
        <code>{props.node.code}</code>
      </Highlight>
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
