// client.js
import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: "ua83pq8w",
  dataset: "production",
  useCdn: false
});
