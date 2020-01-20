import React from "react";
import axios from "axios";

export async function unstable_getStaticPaths() {
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

export async function unstable_getStaticProps(context) {
  const { params } = context;
  const data = await axios
    .get(`https://api.priver.dev/wp-json/acf/v3/works?slug=${params.slug}`)
    .then(d => d.data[0]);
  return { props: { project: data } };
}

class Project extends React.Component {
  render() {
    const { project } = this.props;
    return <h1>{project.acf?.title}</h1>;
  }
}

export default Project;
