import React from "react";
import axios from "axios";

class Project extends React.Component {
  static async getStaticPaths() {
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

  render() {
    return <h1>hej</h1>;
  }
}

export default Project;
