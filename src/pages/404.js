import React from "react";

import SimpleLayout from "../components/simple-layout";
import SEO from "../components/seo";

const NotFoundPage = () => (
  <SimpleLayout>
    <SEO title="404: Not found" />
    <h1 className="section-header">NOT FOUND</h1>
    <p className="section-paragraph">You just hit a route that doesn&#39;t exist... the sadness.</p>
  </SimpleLayout>
);

export default NotFoundPage;
