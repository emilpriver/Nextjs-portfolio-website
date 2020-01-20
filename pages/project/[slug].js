import React from "react";
import axios from "axios";

export async function getStaticPaths() {
  const params = await axios
    .get("https://api.priver.dev/wp-json/acf/v3/works")
    .then(response => response.data)
    .then(response => {
      return response.map(el => {
        return {
          params: {
            slug: el.acf.slug
          }
        };
      });
    });

  return params;
}

class Project extends React.Component {
  render() {
    return <h1>hej</h1>;
  }
}

export default Project;
