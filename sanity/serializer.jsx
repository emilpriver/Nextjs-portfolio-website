import React from "react";
import Highlight from "react-highlight";

const serializers = {
  types: {
    code: props => (
      <Highlight className={props.node.language}>
        <code>{props.node.code}</code>
      </Highlight>
    )
  }
};

export default serializers;
